import { DateTime } from 'luxon'
import Channel from '#models/channel'
import ChannelMembership from '#models/channel_membership'
import User from '#models/user'
import { createChannelValidator, joinByNameValidator } from '#validators/channel'
import type { Socket } from 'socket.io'
import type { AckFn } from '#controllers/ws/channel/utils'
import {
  ensureUser,
  handleException,
  respondError,
  respondSuccess,
} from '#controllers/ws/channel/utils'

type ChannelSummary = {
  id: number
  name: string
  isPrivate: boolean
  ownerId: number
  membershipStatus: string
}

type CancelResponse = {
  message: string
  channelClosed: boolean
}

export default class ChannelManagementController {
  register(socket: Socket) {
    socket.on('channel:list', async (_payload, ack?: AckFn<ChannelSummary[]>) => {
      const user = ensureUser(socket, ack)
      if (!user) return
      try {
        const memberships = await ChannelMembership.query()
          .where('user_id', user.id)
          .whereIn('status', ['active', 'invited'])
          .preload('channel', (query) => query.whereNull('deleted_at'))

        const now = DateTime.now()
        const validMemberships: ChannelMembership[] = []

        for (const m of memberships) {
          const ch = m.channel
          if (!ch) continue

          if (ch.isExpired(now)) {
            ch.deletedAt = now
            ch.closedAt = now
            await ch.save()
            continue
          }

          validMemberships.push(m)
        }

        const data: ChannelSummary[] = validMemberships.map((m) => ({
          id: m.channel!.id,
          name: m.channel!.name,
          isPrivate: m.channel!.isPrivate,
          ownerId: m.channel!.ownerId,
          membershipStatus: m.status,
        }))

        respondSuccess(ack, data)
      } catch (error) {
        handleException(socket, ack, error)
      }
    })

    socket.on('channel:create', async (payload, ack?: AckFn<ChannelSummary>) => {
      const user = ensureUser(socket, ack)
      if (!user) return
      try {
        const data = await createChannelValidator.validate(payload ?? {})
        const existing = await Channel.query()
          .where('name', data.name)
          .whereNull('deleted_at')
          .first()
        if (existing) {
          respondError(socket, ack, 'Channel with this name already exists')
          return
        }

        const now = DateTime.now()
        const channel = await Channel.create({
          name: data.name,
          isPrivate: !!data.isPrivate,
          ownerId: user.id,
          createdAt: now,
          lastActivityAt: now,
        })

        await ChannelMembership.create({
          channelId: channel.id,
          userId: user.id,
          role: 'owner',
          status: 'active',
          joinedAt: now,
        })
        respondSuccess(ack, this.serializeChannel(channel, 'active'))
      } catch (error) {
        handleException(socket, ack, error)
      }
    })

    socket.on('channel:join-by-name', async (payload, ack?: AckFn<ChannelSummary>) => {
      const user = ensureUser(socket, ack)
      if (!user) return
      const start = Date.now()
      try {
        const data = await joinByNameValidator.validate(payload ?? {})
        const now = DateTime.now()

        let channel = await Channel.query().where('name', data.name).whereNull('deleted_at').first()

        if (channel && channel.isExpired(now)) {
          channel.deletedAt = now
          channel.closedAt = now
          await channel.save()
          channel = null
        }

        if (!channel) {
          channel = await Channel.create({
            name: data.name,
            isPrivate: !!data.isPrivate,
            ownerId: user.id,
            lastActivityAt: now,
          })

          await ChannelMembership.create({
            channelId: channel.id,
            userId: user.id,
            role: 'owner',
            status: 'active',
            joinedAt: now,
          })

          respondSuccess(ack, this.serializeChannel(channel, 'active'))
          return
        }

        let membership = await ChannelMembership.query()
          .where('channel_id', channel.id)
          .where('user_id', user.id)
          .first()

        if (membership && membership.status === 'banned') {
          respondError(socket, ack, 'You are banned in this channel')
          return
        }

        if (channel.isPrivate) {
          const isOwner = channel.ownerId === user.id
          const isInvited = membership && membership.status === 'invited'
          const isActive = membership && membership.status === 'active'

          if (!isOwner && !isInvited && !isActive) {
            respondError(socket, ack, 'Private channel. You need an invite to join.')
            return
          }
        }

        if (!membership) {
          membership = await ChannelMembership.create({
            channelId: channel.id,
            userId: user.id,
            role: user.id === channel.ownerId ? 'owner' : 'member',
            status: 'active',
            joinedAt: now,
          })
        } else if (membership.status !== 'active') {
          membership.status = 'active'
          membership.joinedAt = now
          membership.leftAt = null
          membership.revokedAt = null
          await membership.save()
        }

        const duration = Date.now() - start
        console.log(`WS channel:join-by-name for user ${user.id} took ${duration}ms`)
        respondSuccess(ack, this.serializeChannel(channel, membership?.status ?? 'active'))
      } catch (error) {
        handleException(socket, ack, error)
      }
    })

    socket.on('channel:quit', async (payload, ack?: AckFn<{ message: string }>) => {
      const user = ensureUser(socket, ack)
      if (!user) return
      try {
        const { channelId } = payload ?? {}
        if (!channelId) {
          respondError(socket, ack, 'channelId is required')
          return
        }
        const message = await this.handleQuit(user, Number(channelId))
        respondSuccess(ack, { message })
      } catch (error) {
        handleException(socket, ack, error)
      }
    })

    socket.on('channel:cancel', async (payload, ack?: AckFn<CancelResponse>) => {
      const user = ensureUser(socket, ack)
      if (!user) return
      try {
        const { channelId } = payload ?? {}
        if (!channelId) {
          respondError(socket, ack, 'channelId is required')
          return
        }
        const result = await this.handleCancel(user, Number(channelId))
        respondSuccess(ack, result)
      } catch (error) {
        handleException(socket, ack, error)
      }
    })
  }

  private async handleQuit(user: User, channelId: number) {
    const channel = await Channel.query().where('id', channelId).whereNull('deleted_at').first()
    if (!channel) {
      throw new Error('Channel not found')
    }

    if (channel.ownerId !== user!.id) {
      throw new Error('Only channel owner can close this channel')
    }

    const now = DateTime.now()
    channel.deletedAt = now
    channel.closedAt = now
    await channel.save()

    return `Channel "${channel.name}" has been closed`
  }

  private async handleCancel(user: User, channelId: number) {
    const channel = await Channel.query().where('id', channelId).whereNull('deleted_at').first()
    if (!channel) {
      throw new Error('Channel not found')
    }

    const membership = await ChannelMembership.query()
      .where('channel_id', channel.id)
      .where('user_id', user!.id)
      .where('status', 'active')
      .first()

    if (!membership) {
      throw new Error('You are not an active member of this channel')
    }

    const now = DateTime.now()

    if (membership.role === 'owner') {
      channel.deletedAt = now
      channel.closedAt = now
      await channel.save()
      return {
        message: `Channel "${channel.name}" has been closed by the owner`,
        channelClosed: true,
      }
    }

    membership.status = 'left'
    membership.leftAt = now
    await membership.save()

    return {
      message: `You have left channel "${channel.name}"`,
      channelClosed: false,
    }
  }

  private serializeChannel(channel: Channel, membershipStatus: string): ChannelSummary {
    return {
      id: channel.id,
      name: channel.name,
      isPrivate: channel.isPrivate,
      ownerId: channel.ownerId,
      membershipStatus,
    }
  }
}
