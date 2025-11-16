import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Channel from '#models/channel'
import ChannelMembership from '#models/channel_membership'

export default class ChannelsController {
  public async store({ request, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized()
    }

    const { name, isPrivate } = request.only(['name', 'isPrivate'])


    const existing = await Channel.query()
      .where('name', name).whereNull('deleted_at').first()

    if (existing) {
      return response.badRequest({ message: 'Channel with this name already exists' })
    }

    const now = DateTime.now()

    const channel = await Channel.create({
      name,
      isPrivate: !!isPrivate,
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

    return response.created(channel)
  }


  public async index({ auth }: HttpContext) {
    const user = auth.user!
    const memberships = await ChannelMembership.query()
      .where('user_id', user.id)
      .where('status', 'active')
      .preload('channel', (query) => {
        query.whereNull('deleted_at')
      })

    return memberships
      .filter((m) => m.channel)
      .map((m) => m.channel)
  }

  public async joinByName({ request, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized()
    }

    const { name, isPrivate } = request.only(['name', 'isPrivate'])

    if (!name) {
      return response.badRequest({ message: 'name is required' })
    }

    let channel = await Channel.query()
      .where('name', name)
      .whereNull('deleted_at')
      .first()

    const now = DateTime.now()

    if (!channel) {
      channel = await Channel.create({
        name,
        isPrivate: !!isPrivate,
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

      return response.created(channel)
    }


    if (channel.isPrivate && channel.ownerId !== user.id) {
      return response.forbidden({
        message: 'Private channel. You need an invite to join.',
      })
    }


    let membership = await ChannelMembership.query()
      .where('channel_id', channel.id)
      .where('user_id', user.id)
      .first()

    if (membership) {
      if (membership.status === 'banned') {
        return response.forbidden({ message: 'You are banned in this channel' })
      }

      if (membership.status !== 'active') {
        membership.status = 'active'
        membership.joinedAt = now
        membership.leftAt = null
        membership.revokedAt = null
        await membership.save()
      }

      return channel
    }

    await ChannelMembership.create({
      channelId: channel.id,
      userId: user.id,
      role: user.id === channel.ownerId ? 'owner' : 'member',
      status: 'active',
      joinedAt: now,
    })

    return channel
  }
}
