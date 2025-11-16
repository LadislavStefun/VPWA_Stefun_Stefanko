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
}
