import type { Socket } from 'socket.io'
import ChannelMembership from '#models/channel_membership'
import Message from '#models/message'
import { ensureUser, handleException } from '#controllers/ws/channel/utils'
import type User from '#models/user'
import type { AckFn } from '#controllers/ws/channel/utils'

type HistoryPayload = {
  channelId: number
  beforeId?: number
  limit?: number
}

type TypingPayload = {
  channelId: number
  isTyping: boolean
  content?: string
}

export default class ChannelRoomController {
  register(socket: Socket) {
    const user = socket.data.user as User | undefined
    if (user) {
      socket.join(this.getUserRoom(user.id))
    }

    socket.on('channel:join', async (channelId: number) => {
      const user = ensureUser(socket)
      if (!user) return

      try {
        const membership = await ChannelMembership.query()
          .where('channel_id', channelId)
          .where('user_id', user.id)
          .first()

        if (!membership) {
          socket.emit('channel:error', { message: 'You are not a member of this channel' })
          return
        }
        if (membership.status !== 'active') {
          socket.emit('channel:error', {
            channelId,
            message: 'You must accept the invite before you can view this channel',
          })
          return
        }

        const room = this.getChannelRoom(channelId)
        socket.join(room)

        const messages = await this.fetchMessages(channelId, undefined, 50)
        socket.emit('channel:history', {
          channelId,
          messages,
        })
      } catch (error) {
        handleException(socket, undefined, error)
      }
    })

    socket.on('user:typing', async (payload: TypingPayload, ack?: AckFn) => {
      const user = ensureUser(socket, ack)
      if (!user) return

      try {
        const { channelId, isTyping, content } = payload ?? {}
        if (!channelId) {
          ack?.({ success: false, message: 'channelId is required' })
          return
        }

        const membership = await ChannelMembership.query()
          .where('channel_id', channelId)
          .where('user_id', user.id)
          .where('status', 'active')
          .first()

        if (!membership) {
          ack?.({ success: false, message: 'You are not a member of this channel' })
          return
        }

        const room = this.getChannelRoom(channelId)
        socket.to(room).emit('user:typing', {
          channelId,
          userId: user.id,
          nickName: user.nickName,
          isTyping: !!isTyping,
          content: isTyping && typeof content === 'string' ? content.slice(0, 500) : '',
        })
        ack?.({ success: true, data: {} })
      } catch (error) {
        handleException(socket, ack, error)
      }
    })

    socket.on('channel:history', async (payload: HistoryPayload, ack?: AckFn) => {
      const user = ensureUser(socket, ack)
      if (!user) return

      try {
        const membership = await ChannelMembership.query()
          .where('channel_id', payload.channelId)
          .where('user_id', user.id)
          .where('status', 'active')
          .first()

        if (!membership) {
          ack?.({ success: false, message: 'You are not a member of this channel' })
          return
        }

        const messages = await this.fetchMessages(payload.channelId, payload.beforeId, payload.limit)
        ack?.({ success: true, data: { channelId: payload.channelId, messages } })
      } catch (error) {
        handleException(socket, ack, error)
      }
    })
  }

  private async fetchMessages(channelId: number, beforeId?: number, limit = 50) {
    const safeLimit = Math.min(Math.max(limit ?? 50, 1), 200)

    const query = Message.query()
      .where('channel_id', channelId)
      .orderBy('id', 'desc')
      .limit(safeLimit)
      .preload('author')

    if (beforeId) {
      query.where('id', '<', beforeId)
    }

    const messages = await query
    return messages.reverse().map((msg) => ({
      id: msg.id,
      content: msg.content,
      channelId: msg.channelId,
      createdAt: msg.createdAt.toISO(),
      author: {
        id: msg.author.id,
        nickName: msg.author.nickName,
      },
    }))
  }

  private getChannelRoom(channelId: number) {
    return `channel:${channelId}`
  }

  private getUserRoom(userId: number) {
    return `user:${userId}`
  }
}
