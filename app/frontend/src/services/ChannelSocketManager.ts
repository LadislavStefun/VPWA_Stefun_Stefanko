import type { Socket } from 'socket.io-client'
import socketManager from './socketManager'
import { useMessagesStore } from 'src/store/messageStore'
import { useChannelsStore } from 'src/store/channelStore'
import authManager from 'src/services/authManager'
import type { Message } from 'src/types'
import { useAuthStore } from 'src/store/authStore'
import type { UserStatus } from 'src/types'

interface AuthorPayload {
  id: number
  nickName: string
}

interface MentionPayload {
  id: number
  nickName: string
}

interface MessagePayload {
  id: number
  channelId: number
  content: string
  createdAt: string
  author: AuthorPayload
  mentions?: MentionPayload[]
}

interface HistoryPayload {
  channelId: number
  messages: MessagePayload[]
}

interface HistoryRequestPayload {
  channelId: number
  beforeId?: number
  limit?: number
}

type AckResponse<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      message: string
    }

type ChannelSummary = {
  id: number
  name: string
  isPrivate: boolean
  ownerId: number
  membershipStatus: 'active' | 'invited' | 'left' | 'revoked' | 'banned' | 'declined'
}

type CancelResponse = {
  message: string
  channelClosed: boolean
}
export type ChannelMember = {
  id: number
  nickName: string
  email: string | null
  role: 'owner' | 'member'
  status: UserStatus
  membershipStatus?: string
}

class ChannelSocketManager {
  private socket: Socket | null = null
  private isInitialized = false
  private pendingJoins = new Set<number>()
  private pendingMessages: Array<{ channelId: number; content: string }> = []
  private readyResolvers: Array<(socket: Socket) => void> = []
  private isOffline = false

  constructor() {
    socketManager.onReady((baseSocket) => {
      if (authManager.getToken()) {
        this.attachNamespace(baseSocket)
      }
    })

    authManager.onChange((token) => {
      this.teardown()

      if (!token) {
        return
      }

      const authStore = useAuthStore()
      this.isOffline = authStore.userStatus === 'offline'

      if (socketManager.isConnected && socketManager.baseSocket) {
        this.attachNamespace(socketManager.baseSocket)
      }
    })

    if (authManager.getToken() && socketManager.isConnected && socketManager.baseSocket) {
      this.attachNamespace(socketManager.baseSocket)
    }
  }

  private attachNamespace(baseSocket: Socket) {
    const authStore = useAuthStore()
    if (this.socket || this.isOffline || authStore.userStatus === 'offline') return

    const token = authManager.getToken()
    if (!token) {
      return
    }

    this.socket = baseSocket.io.socket('/channels', {
      auth: { token },
    })

    this.registerListeners()
    this.socket.connect()
  }

  private teardown() {
    if (!this.socket) return
    this.socket.removeAllListeners()
    this.socket.disconnect()
    this.socket = null
    this.isInitialized = false
  }

  private registerListeners() {
    if (this.isInitialized || !this.socket) return
    this.isInitialized = true
    const socket = this.socket

    socket.on('channel:history', (payload: HistoryPayload) => {
      const store = useMessagesStore()
      const normalized = payload.messages.map((msg) => this.toMessage(msg))
      store.setHistory(payload.channelId, normalized)
    })

    socket.on('channel:message', (message: MessagePayload) => {
      this.handleIncomingMessage(message)
    })

    socket.on('channel:error', (payload: { message: string; channelId?: number }) => {
      console.warn('Channel socket error:', payload.message)

      const messagesStore = useMessagesStore()
      const channelsStore = useChannelsStore()

      if (payload.channelId != null) {
        messagesStore.setChannelNotice(String(payload.channelId), payload.message)
        } else if (channelsStore.activeChannelId) {
        messagesStore.setChannelNotice(channelsStore.activeChannelId, payload.message)
      }
      })

    socket.on('channel:membership', (channel: ChannelSummary) => {
      const store = useChannelsStore()
      store.handleMembershipUpdate(channel)
    })

    socket.on('channel:invited', (channel: ChannelSummary) => {
      const store = useChannelsStore()
      store.upsertChannelFromSocket(channel)
    })

    socket.on('error', (error: string) => {
      console.error('Channel socket transport error:', error)
    })

    socket.on('disconnect', () => {
      this.isInitialized = false
    })

    socket.on('connect', () => {
      this.flushQueues()
      this.readyResolvers.forEach((resolve) => resolve(socket))
      this.readyResolvers = []
      const channelStore = useChannelsStore()
      if (channelStore.activeChannelId) {
        const id = parseInt(channelStore.activeChannelId)
        this.join(id)
      }
    })

    socket.on('connect_error', (error) => {
      console.error('Channel namespace connect error:', error)
    })
  }

  private flushQueues() {
    const socket = this.socket
    if (!socket) return

    this.pendingJoins.forEach((id) => socket.emit('channel:join', id))
    this.pendingJoins.clear()

    this.pendingMessages.forEach(({ channelId, content }) => {
      socket.emit('channel:message', { channelId, content })
    })
    this.pendingMessages = []
  }

  private handleIncomingMessage(messagePayload: MessagePayload) {
    const message = this.toMessage(messagePayload)
    useMessagesStore().addMessage(messagePayload.channelId, message)
  }

  private toMessage(payload: MessagePayload): Message {
  const authStore = useAuthStore()
  const currentUserId = authStore.user ? String(authStore.user.id) : null

  const isTagged =
    currentUserId !== null &&
    (payload.mentions ?? []).some((m) => String(m.id) === currentUserId)

  return {
    id: String(payload.id),
    channelId: String(payload.channelId),
    userId: String(payload.author.id),
    name: payload.author.nickName,
    text: [payload.content],
    createdAt: payload.createdAt,
    tagged: isTagged,
    sent: currentUserId === String(payload.author.id),
    typing: false,
  }
}

  join(channelId: number) {
    if (!this.socket) {
      this.pendingJoins.add(channelId)
      console.warn('Channel socket not connected, join queued')
      return
    }
    this.socket.emit('channel:join', channelId)
  }

  sendMessage(channelId: number, content: string) {
    const authStore = useAuthStore()
    if (authStore.userStatus === 'offline') {
      console.warn('Cannot send message while offline')
      return
    }

    if (!this.socket) {
      this.pendingMessages.push({ channelId, content })
      console.warn('Channel socket not connected, message queued')
      return
    }
    this.socket.emit('channel:message', { channelId, content })
  }

  sendTyping(channelId: number, isTyping: boolean) {
    if (!this.socket) {
      return
    }
    this.socket.emit('user:typing', { channelId, isTyping })
  }

  leave(channelId: number) {
    if (!this.socket) {
      return
    }
    this.socket.emit('channel:leave', channelId)
  }
  goOffline() {
    this.isOffline = true
    this.teardown()
  }

  async waitUntilReady() {
    await this.waitForConnection()
  }

  async goOnline() {
    const authStore = useAuthStore()
    if (authStore.userStatus === 'offline') {
      return
    }
    this.isOffline = false

    if (!socketManager.baseSocket || !authManager.getToken()) {
      return
    }

    this.attachNamespace(socketManager.baseSocket)

    try {
      await this.waitUntilReady()
      const channelStore = useChannelsStore()
      channelStore.reset()
      await channelStore.loadChannels()
    } catch (e) {
      console.error('Failed to re-connect channels namespace', e)
    }
  }

  private async waitForConnection(): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.readyResolvers = this.readyResolvers.filter((fn) => fn !== resolver)
        reject(new Error('Channel socket is not connected'))
      }, 8000)

      const resolver = (socket: Socket) => {
        clearTimeout(timeout)
        resolve(socket)
      }

      this.readyResolvers.push(resolver)
      if (!this.socket && socketManager.baseSocket && authManager.getToken()) {
        this.attachNamespace(socketManager.baseSocket)
      }
    })
  }

  private async emitWithAck<T>(event: string, payload?: unknown): Promise<T> {
    const socket = await this.waitForConnection()

    return new Promise<T>((resolve, reject) => {
      socket.emit(event, payload, (response: AckResponse<T>) => {
        if (!response) {
          reject(new Error('No response from server'))
          return
        }

        if (response.success) {
          resolve(response.data)
        } else {
          reject(new Error(response.message || 'Channel action failed'))
        }
      })
    })
  }

  fetchChannels() {
    return this.emitWithAck<ChannelSummary[]>('channel:list')
  }
  fetchMembers(channelId: number) {
  return this.emitWithAck<ChannelMember[]>('channel:members', { channelId })
  }

  createChannel(name: string, isPrivate: boolean) {
    return this.emitWithAck<ChannelSummary>('channel:create', { name, isPrivate })
  }

  joinChannelByName(name: string, isPrivate: boolean) {
    return this.emitWithAck<ChannelSummary>('channel:join-by-name', { name, isPrivate })
  }

  inviteUser(channelId: number, nickName: string) {
    return this.emitWithAck<{ message: string }>('channel:invite', { channelId, nickName })
  }

  revokeUser(channelId: number, nickName: string) {
    return this.emitWithAck<{ message: string }>('channel:revoke', { channelId, nickName })
  }

  kickUser(channelId: number, nickName: string) {
    return this.emitWithAck<{ message: string }>('channel:kick', { channelId, nickName })
  }

  quitChannel(channelId: number) {
    return this.emitWithAck<{ message: string }>('channel:quit', { channelId })
  }

  cancelMembership(channelId: number) {
    return this.emitWithAck<CancelResponse>('channel:cancel', { channelId })
  }

  declineInvite(channelId: number) {
    return this.emitWithAck<{ message: string }>('channel:decline', { channelId })
  }

  fetchHistory(payload: HistoryRequestPayload) {
    return this.emitWithAck<{ channelId: number; messages: MessagePayload[] }>(
      'channel:history',
      payload
    ).then((res) => res.messages.map((msg) => this.toMessage(msg)))
  }
}

export default new ChannelSocketManager()
