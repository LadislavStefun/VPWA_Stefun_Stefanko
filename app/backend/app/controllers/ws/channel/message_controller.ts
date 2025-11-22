import type { Socket } from 'socket.io'
import Channel from '#models/channel'
import ChannelMembership from '#models/channel_membership'
import Message from '#models/message'
import type { AckFn } from '#controllers/ws/channel/utils'
import { ensureUser, handleException } from '#controllers/ws/channel/utils'
import { DateTime } from 'luxon'

type MessagePayload = {
  channelId: number
  content: string
}

export default class ChannelMessageController {
  register(socket: Socket) {
    socket.on('channel:message', async (payload: MessagePayload, ack?: AckFn<{ id: number }>) => {
      const user = ensureUser(socket, ack)
      if (!user) return

      try {
        const channel = await Channel.find(payload.channelId)
        if (!channel) {
          socket.emit('channel:error', { message: 'Channel not found' })
          return
        }

        const membership = await ChannelMembership.query()
          .where('channel_id', payload.channelId)
          .where('user_id', user.id)
          .where('status', 'active')
          .first()

        if (!membership) {
          socket.emit('channel:error', { message: 'You are not a member of this channel' })
          return
        }

        const message = await Message.create({
          channelId: payload.channelId,
          authorId: user.id,
          content: payload.content,
        })
        await message.load('author')
        channel.lastActivityAt = DateTime.now()
        await channel.save()
        const serialized = {
          id: message.id,
          content: message.content,
          channelId: message.channelId,
          createdAt: message.createdAt,
          author: {
            id: user.id,
            nickName: user.nickName,
          },
        }

        socket.to(this.getChannelRoom(payload.channelId)).emit('channel:message', serialized)
        socket.emit('channel:message', serialized)
        ack?.({ success: true, data: { id: message.id } })
      } catch (error) {
        handleException(socket, ack, error)
      }
    })
  }

  private getChannelRoom(channelId: number) {
    return `channel:${channelId}`
  }
}
