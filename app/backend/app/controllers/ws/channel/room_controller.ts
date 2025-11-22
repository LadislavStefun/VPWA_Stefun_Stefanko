import type { Socket } from 'socket.io'
import ChannelMembership from '#models/channel_membership'
import Message from '#models/message'
import { ensureUser, handleException } from '#controllers/ws/channel/utils'
import type User from '#models/user'

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
            message: 'You must accept the invite before you can view this channel',
          })
          return
        }

        const room = this.getChannelRoom(channelId)
        socket.join(room)

        const messages = await Message.query()
          .where('channel_id', channelId)
          .orderBy('created_at', 'desc')
          .limit(50)
          .preload('author')

        socket.emit('channel:history', {
          channelId,
          messages: messages.reverse().map((msg) => ({
            id: msg.id,
            content: msg.content,
            channelId: msg.channelId,
            createdAt: msg.createdAt,
            author: {
              id: msg.author.id,
              nickName: msg.author.nickName,
            },
          })),
        })
      } catch (error) {
        handleException(socket, undefined, error)
      }
    })
  }

  private getChannelRoom(channelId: number) {
    return `channel:${channelId}`
  }

  private getUserRoom(userId: number) {
    return `user:${userId}`
  }
}
