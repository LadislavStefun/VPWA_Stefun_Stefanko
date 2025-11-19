import type { Socket } from 'socket.io'
import User from '#models/user'
import auth from '@adonisjs/auth/services/main'
import { HttpContextFactory } from '@adonisjs/core/factories/http'

class SocketAuthService {
  private ctxFactory = new HttpContextFactory()

  async authenticate(socket: Socket): Promise<User> {
    const header = socket.handshake.headers.authorization
    const tokenFromHeader = header?.startsWith('Bearer ') ? header.slice(7) : undefined
    const token = socket.handshake.auth?.token ?? tokenFromHeader

    if (!token) {
      throw new Error('Missing auth token')
    }

    const ctx = this.ctxFactory.create()
    ctx.request.request.headers.authorization = `Bearer ${token}`

    const authenticator = auth.createAuthenticator(ctx)

    try {
      return (await authenticator.use('api').authenticate()) as User
    } catch {
      socket.disconnect()
      throw new Error('Authentication failed')
    }
  }
}

export default new SocketAuthService()
