import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Channel from '#models/channel'
import ChannelMembership from '#models/channel_membership'
import User from '#models/user'
import KickVote from '#models/kick_vote'

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


     let membership = await ChannelMembership.query()
    .where('channel_id', channel.id)
    .where('user_id', user.id)
    .first()

  if (membership && membership.status === 'banned') {
    return response.forbidden({ message: 'You are banned in this channel' })
  }


  if (channel.isPrivate) {
    const isOwner = channel.ownerId === user.id
    const isInvited = membership && membership.status === 'invited'
    const isActive = membership && membership.status === 'active'

    if (!isOwner && !isInvited && !isActive) {
      return response.forbidden({
        message: 'Private channel. You need an invite to join.',
      })
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


    return channel
  }


  public async invite({ params, request, auth, response }: HttpContext) {
  const user = auth.user
  if (!user) {
    return response.unauthorized()
  }

  const channelId = Number(params.id)
  const { nickName } = request.only(['nickName'])

  if (!nickName) {
    return response.badRequest({ message: 'nickName is required' })
  }

  const channel = await Channel.query()
    .where('id', channelId)
    .whereNull('deleted_at')
    .first()

  if (!channel) {
    return response.notFound({ message: 'Channel not found' })
  }

  const myMembership = await ChannelMembership.query()
    .where('channel_id', channel.id)
    .where('user_id', user.id)
    .where('status', 'active')
    .first()

  if (!myMembership) {
    return response.forbidden({ message: 'You are not a member of this channel' })
  }

  if (channel.isPrivate && myMembership.role !== 'owner') {
    return response.forbidden({
      message: 'Only channel owner can invite users to a private channel',
    })
  }
  const rawNick = nickName.trim()
  const normalizedNick = rawNick.toLowerCase()

  const targetUser = await User.query()
    .whereRaw('lower(nick_name) = ?', [normalizedNick])
    .first()

  if (!targetUser) {
    return response.notFound({ message: 'User not found' })
  }

  if (targetUser.id === user.id) {
    return response.badRequest({ message: 'You cannot invite yourself' })
  }

  const now = DateTime.now()

  let membership = await ChannelMembership.query()
    .where('channel_id', channel.id)
    .where('user_id', targetUser.id)
    .first()

  if (!membership) {
    membership = await ChannelMembership.create({
      channelId: channel.id,
      userId: targetUser.id,
      role: 'member',
      status: 'invited',
      invitedById: user.id,
      invitedAt: now,
    })
  } else {
  if (membership.status === 'active') {
    return response.badRequest({
      message: 'User is already a member of this channel',
    })
  }

  const wasBanned = membership.status === 'banned'

  if (wasBanned && myMembership.role !== 'owner') {
    return response.forbidden({
      message: 'Only channel owner can restore access for a banned user',
    })
  }

  membership.status = 'invited'
  membership.invitedById = user.id
  membership.invitedAt = now
  membership.revokedAt = null
  membership.bannedAt = null
  membership.banReason = null
  await membership.save()

  if (wasBanned) {
    await KickVote.query()
      .where('channel_id', channel.id)
      .where('target_user_id', targetUser.id)
      .delete()
  }
  }

  return { message: 'User invited to channel' }
}

public async revoke({ params, request, auth, response }: HttpContext) {
  const user = auth.user
  if (!user) {
    return response.unauthorized()
  }

  const channelId = Number(params.id)
  const { nickName } = request.only(['nickName'])

  if (!nickName) {
    return response.badRequest({ message: 'nickName is required' })
  }

  const channel = await Channel.query()
    .where('id', channelId)
    .whereNull('deleted_at')
    .first()

  if (!channel) {
    return response.notFound({ message: 'Channel not found' })
  }

  const myMembership = await ChannelMembership.query()
    .where('channel_id', channel.id)
    .where('user_id', user.id)
    .where('status', 'active')
    .first()

  if (!myMembership) {
    return response.forbidden({ message: 'You are not a member of this channel' })
  }

  if (channel.isPrivate && myMembership.role !== 'owner') {
    return response.forbidden({
      message: 'Only channel owner can revoke users in a private channel',
    })
  }

  const rawNick = nickName.trim()
  const normalizedNick = rawNick.toLowerCase()

  const targetUser = await User.query()
  .whereRaw('lower(nick_name) = ?', [normalizedNick])
  .first()

  if (!targetUser) {
  return response.notFound({ message: 'User not found' })
  }

  const membership = await ChannelMembership.query()
    .where('channel_id', channel.id)
    .where('user_id', targetUser.id)
    .first()

  if (!membership) {
    return response.notFound({ message: 'User is not in this channel' })
  }

  const now = DateTime.now()
  membership.status = 'revoked'
  membership.revokedAt = now
  await membership.save()

  return {
    message: 'User revoked from channel',
  }
}

public async kick({ params, request, auth, response }: HttpContext) {
  const user = auth.user
  if (!user) {
    return response.unauthorized()
  }

  const channelId = Number(params.id)
  const { nickName } = request.only(['nickName'])

  if (!nickName) {
    return response.badRequest({ message: 'nickName is required' })
  }

  const channel = await Channel.query()
    .where('id', channelId)
    .whereNull('deleted_at')
    .first()

  if (!channel) {
    return response.notFound({ message: 'Channel not found' })
  }

  if (channel.isPrivate) {
    return response.forbidden({
      message: 'Kick is only available in public channels. Use /revoke in private channels.',
    })
  }
  const myMembership = await ChannelMembership.query()
    .where('channel_id', channel.id)
    .where('user_id', user.id)
    .where('status', 'active')
    .first()

  if (!myMembership) {
    return response.forbidden({ message: 'You are not a member of this channel' })
  }

  const rawNick = nickName.trim()
  const normalizedNick = rawNick.toLowerCase()

  const targetUser = await User.query()
    .whereRaw('lower(nick_name) = ?', [normalizedNick])
    .first()

  if (!targetUser) {
    return response.notFound({ message: 'User not found' })
  }

  if (targetUser.id === user.id) {
    return response.badRequest({ message: 'You cannot kick yourself' })
  }
  const targetMembership = await ChannelMembership.query()
    .where('channel_id', channel.id)
    .where('user_id', targetUser.id)
    .first()

  if (!targetMembership) {
    return response.badRequest({
      message: 'User is not a member of this channel',
    })
  }

  if (targetMembership.role === 'owner') {
    return response.forbidden({
      message: 'Channel owner cannot be kicked',
    })
  }

  if (targetMembership.status === 'banned') {
    return response.badRequest({
      message: 'User is already banned from this channel',
    })
  }

  const now = DateTime.now()

  if (myMembership.role === 'owner') {
    targetMembership.status = 'banned'
    targetMembership.bannedAt = now
    targetMembership.banReason = 'owner_kick'
    targetMembership.leftAt = now
    targetMembership.revokedAt = null
    await targetMembership.save()

    await KickVote.query()
      .where('channel_id', channel.id)
      .where('target_user_id', targetUser.id)
      .delete()

    return {
      message: `User ${nickName} has been permanently banned from the channel by the owner`,
    }
  }


  const existingVote = await KickVote.query()
    .where('channel_id', channel.id)
    .where('target_user_id', targetUser.id)
    .where('voter_user_id', user.id)
    .first()

  if (existingVote) {
    return response.badRequest({
      message: 'You have already voted to kick this user',
    })
  }

  await KickVote.create({
    channelId: channel.id,
    targetUserId: targetUser.id,
    voterUserId: user.id,
  })

  const votes = await KickVote.query()
    .where('channel_id', channel.id)
    .where('target_user_id', targetUser.id)
    .countDistinct('voter_user_id as total')

  const totalVotes = Number(votes[0].$extras.total ?? 0)


  if (totalVotes >= 3) {
    targetMembership.status = 'banned'
    targetMembership.bannedAt = now
    targetMembership.banReason = 'vote_kick'
    targetMembership.leftAt = now
    targetMembership.revokedAt = null
    await targetMembership.save()

    return {
      message: `User ${nickName} has been permanently banned from the channel (votes: ${totalVotes})`,
    }
  }


  if (targetMembership.status === 'active') {
    targetMembership.status = 'revoked'
    targetMembership.leftAt = now
    await targetMembership.save()
  }

  return {
    message: `Kick vote recorded for ${nickName} (${totalVotes}/3) – user has been temporarily kicked`,
  }
}

public async quit({ params, auth, response }: HttpContext) {
  const user = auth.user
  if (!user) {
    return response.unauthorized()
  }

  const channelId = Number(params.id)

  const channel = await Channel.query()
    .where('id', channelId)
    .whereNull('deleted_at')
    .first()

  if (!channel) {
    return response.notFound({ message: 'Channel not found' })
  }

  if (channel.ownerId !== user.id) {
    return response.forbidden({
      message: 'Only channel owner can close this channel',
    })
  }

  const now = DateTime.now()

  channel.deletedAt = now
  channel.closedAt = now
  await channel.save()

  return {
    message: `Channel "${channel.name}" has been closed`,
  }
}


}
