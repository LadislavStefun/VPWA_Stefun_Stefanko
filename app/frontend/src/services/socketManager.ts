import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import authManager from 'src/services/authManager'

const WS_URL = import.meta.env.VITE_API_WS_URL || import.meta.env.VITE_API_URL

type ReadyListener = (socket: Socket) => void

class SocketManager {
  private socket: Socket | null = null
  private listeners: ReadyListener[] = []

  constructor() {
    authManager.onChange(() => this.reconnect())
    this.reconnect()
  }

  private notifyReady() {
    if (!this.socket) return
    this.listeners.forEach((listener) => listener(this.socket as Socket))
  }

  private reconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }

    const token = authManager.getToken()
    if (!token) {
      return
    }

    if (!WS_URL) {
      console.error('Missing VITE_API_WS_URL (or VITE_API_URL) env variable for sockets')
      return
    }

    this.socket = io(WS_URL, {
      withCredentials: true,
      auth: { token },
    })

    this.socket.on('connect', () => this.notifyReady())
  }

  onReady(listener: ReadyListener) {
    this.listeners.push(listener)
    if (this.socket?.connected) {
      listener(this.socket)
    }
  }

  getNamespace(name: string) {
    if (!this.socket) {
      throw new Error('Socket not connected')
    }
    return this.socket.io.socket(name)
  }

  get baseSocket() {
    return this.socket
  }

  get isConnected() {
    return !!this.socket?.connected
  }
}

export default new SocketManager()
