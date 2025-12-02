import { DateTime } from 'luxon'
import type { Socket } from 'socket.io'
import Channel from '#models/channel'
import ChannelMembership from '#models/channel_membership'
import User from '#models/user'
import KickVote from '#models/kick_vote'
import { nickNameValidator } from '#validators/channel'
import type { AckFn } from '#controllers/ws/channel/utils'
import {
  ensureUser,
  handleException,
  respondError,
  respondSuccess,
} from '#controllers/ws/channel/utils'
import { io } from '#start/ws'

type MemberSummary = {
  id: number
  nickName: string
  email: string | null
  role: 'owner' | 'member'
  status: string
}

export default class ChannelMembershipController {
  register(socket: Socket) {
    socket.on('channel:members', async (payload, ack?: AckFn<MemberSummary[]>) => {
      const user = ensureUser(socket, ack)
      if (!user) return

      try {
        const { channelId } = payload ?? {}
        if (!channelId) {
          respondError(socket, ack, 'channelId is required')
          return
        }

        const myMembership = await ChannelMembership.query()
          .where('channel_id', channelId)
          .where('user_id', user.id)
          .where('status', 'active')
          .first()

        if (!myMembership) {
          respondError(socket, ack, 'You are not an active member of this channel')
          return
        }

        const memberships = await ChannelMembership.query()
          .where('channel_id', channelId)
          .whereIn('status', ['active'])
          .preload('user')

        const result: MemberSummary[] = memberships.map((m) => ({
          id: m.user.id,
          nickName: m.user.nickName,
          email: m.user.email,
          role: m.role as 'owner' | 'member',
          status: m.status,
        }))

        respondSuccess(ack, result)
      } catch (error) {
        handleException(socket, ack, error)
      }
    })
    socket.on('channel:invite', async (payload, ack?: AckFn<{ message: string }>) => {
      const user = ensureUser(socket, ack)
      if (!user) return
      try {
        const { channelId, nickName } = payload ?? {}
        if (!channelId) {
          respondError(socket, ack, 'channelId is required')
          return
        }
        const { nickName: validatedNick } = await nickNameValidator.validate({ nickName })
        await this.handleInvite(user, Number(channelId), validatedNick)
        respondSuccess(ack, { message: 'User invited to channel' })
      } catch (error) {
        handleException(socket, ack, error)
      }
    })

    socket.on('channel:revoke', async (payload, ack?: AckFn<{ message: string }>) => {
      const user = ensureUser(socket, ack)
      if (!user) return
      try {
        const { channelId, nickName } = payload ?? {}
        if (!channelId) {
          respondError(socket, ack, 'channelId is required')
          return
        }
        const { nickName: validatedNick } = await nickNameValidator.validate({ nickName })
        const message = await this.handleRevoke(user, Number(channelId), validatedNick)
        respondSuccess(ack, { message })
      } catch (error) {
        handleException(socket, ack, error)
      }
    })

    socket.on('channel:kick', async (payload, ack?: AckFn<{ message: string }>) => {
      const user = ensureUser(socket, ack)
      if (!user) return
      try {
        const { channelId, nickName } = payload ?? {}
        if (!channelId) {
          respondError(socket, ack, 'channelId is required')
          return
        }
        const { nickName: validatedNick } = await nickNameValidator.validate({ nickName })
        const message = await this.handleKick(user, Number(channelId), validatedNick)
        respondSuccess(ack, { message })
      } catch (error) {
        handleException(socket, ack, error)
      }
    })

    socket.on('channel:decline', async (payload, ack?: AckFn<{ message: string }>) => {
      const user = ensureUser(socket, ack)
      if (!user) return
      try {
        const { channelId } = payload ?? {}
        if (!channelId) {
          respondError(socket, ack, 'channelId is required')
          return
        }
        const message = await this.handleDecline(user, Number(channelId))
        respondSuccess(ack, { message })
      } catch (error) {
        handleException(socket, ack, error)
      }
    })
  }

  private async handleInvite(user: User, channelId: number, nickName: string) {
    const channel = await Channel.query().where('id', channelId).whereNull('deleted_at').first()
    if (!channel) {
      throw new Error('Channel not found')
    }

    const myMembership = await ChannelMembership.query()
      .where('channel_id', channel.id)
      .where('user_id', user.id)
      .where('status', 'active')
      .first()

    if (!myMembership) {
      throw new Error('You are not a member of this channel')
    }

    if (channel.isPrivate && myMembership.role !== 'owner') {
      throw new Error('Only channel owner can invite users to a private channel')
    }

    const normalizedNick = nickName.trim().toLowerCase()
    const targetUser = await User.query().whereRaw('lower(nick_name) = ?', [normalizedNick]).first()

    if (!targetUser) {
      throw new Error('User not found')
    }

    if (targetUser.id === user.id) {
      throw new Error('You cannot invite yourself')
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
      this.notifyChannelUpdate(targetUser.id, channel, membership.status)
      return
    }

    if (membership.status === 'active') {
      throw new Error('User is already a member of this channel')
    }

    const wasBanned = membership.status === 'banned'
    if (wasBanned && myMembership.role !== 'owner') {
      throw new Error('Only channel owner can restore access for a banned user')
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
    this.notifyChannelUpdate(targetUser.id, channel, membership.status)
  }

  private async handleRevoke(user: User, channelId: number, nickName: string) {
    const channel = await Channel.query().where('id', channelId).whereNull('deleted_at').first()
    if (!channel) {
      throw new Error('Channel not found')
    }

    const myMembership = await ChannelMembership.query()
      .where('channel_id', channel.id)
      .where('user_id', user.id)
      .where('status', 'active')
      .first()

    if (!myMembership) {
      throw new Error('You are not a member of this channel')
    }

    if (channel.isPrivate && myMembership.role !== 'owner') {
      throw new Error('Only channel owner can revoke users in a private channel')
    }

    const normalizedNick = nickName.trim().toLowerCase()
    const targetUser = await User.query().whereRaw('lower(nick_name) = ?', [normalizedNick]).first()
    if (!targetUser) {
      throw new Error('User not found')
    }

    const membership = await ChannelMembership.query()
      .where('channel_id', channel.id)
      .where('user_id', targetUser.id)
      .first()

    if (!membership) {
      throw new Error('User is not in this channel')
    }

    const now = DateTime.now()
    membership.status = 'revoked'
    membership.revokedAt = now
    await membership.save()

    await this.notifyMembershipChange(targetUser.id, channel, membership.status)

    return 'User revoked from channel'
  }

  private async handleKick(user: User, channelId: number, nickName: string) {
    const channel = await Channel.query().where('id', channelId).whereNull('deleted_at').first()
    if (!channel) {
      throw new Error('Channel not found')
    }

    const myMembership = await ChannelMembership.query()
      .where('channel_id', channel.id)
      .where('user_id', user.id)
      .where('status', 'active')
      .first()

    if (!myMembership) {
      throw new Error('You are not a member of this channel')
    }

    const normalizedNick = nickName.trim().toLowerCase()
    const targetUser = await User.query().whereRaw('lower(nick_name) = ?', [normalizedNick]).first()
    if (!targetUser) {
      throw new Error('User not found')
    }

    if (targetUser.id === user.id) {
      throw new Error('You cannot kick yourself')
    }

    const targetMembership = await ChannelMembership.query()
      .where('channel_id', channel.id)
      .where('user_id', targetUser.id)
      .first()

    if (!targetMembership) {
      throw new Error('User is not a member of this channel')
    }

    if (targetMembership.role === 'owner') {
      throw new Error('Channel owner cannot be kicked')
    }

    if (targetMembership.status === 'banned') {
      throw new Error('User is already banned from this channel')
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

      await this.notifyMembershipChange(targetUser.id, channel, targetMembership.status)

      return `User ${nickName} has been permanently banned from the channel by the owner`
    }

    const existingVote = await KickVote.query()
      .where('channel_id', channel.id)
      .where('target_user_id', targetUser.id)
      .where('voter_user_id', user.id)
      .first()

    if (existingVote) {
      throw new Error('You have already voted to kick this user')
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

      await this.notifyMembershipChange(targetUser.id, channel, targetMembership.status)

      return `User ${nickName} has been permanently banned from the channel (votes: ${totalVotes})`
    }

    if (targetMembership.status === 'active') {
      targetMembership.status = 'revoked'
      targetMembership.leftAt = now
      await targetMembership.save()
      await this.notifyMembershipChange(targetUser.id, channel, targetMembership.status)
    }

    return `Kick vote recorded for ${nickName} (${totalVotes}/3) – user has been temporarily kicked`
  }

  private async handleDecline(user: User, channelId: number) {
    const membership = await ChannelMembership.query()
      .where('channel_id', channelId)
      .where('user_id', user.id)
      .where('status', 'invited')
      .first()

    if (!membership) {
      throw new Error('You do not have a pending invite for this channel')
    }

    const now = DateTime.now()
    membership.status = 'declined'
    membership.revokedAt = now
    await membership.save()

    return 'Invite declined'
  }

  private async notifyMembershipChange(
    targetUserId: number,
    channel: Channel,
    membershipStatus: string
  ) {
    if (!io) return
    const payload = {
      id: channel.id,
      name: channel.name,
      isPrivate: channel.isPrivate,
      ownerId: channel.ownerId,
      membershipStatus,
    }
    const namespace = io.of('/channels')
    const userRoom = `user:${targetUserId}`
    namespace.to(userRoom).emit('channel:membership', payload)

    if (membershipStatus !== 'active') {
      const channelRoom = `channel:${channel.id}`
      const sockets = await namespace.in(userRoom).fetchSockets()
      sockets.forEach((sock) => sock.leave(channelRoom))
    }
  }

  private notifyChannelUpdate(targetUserId: number, channel: Channel, membershipStatus: string) {
    if (!io) return
    const payload = {
      id: channel.id,
      name: channel.name,
      isPrivate: channel.isPrivate,
      ownerId: channel.ownerId,
      membershipStatus,
    }
    const userRoom = `user:${targetUserId}`
    io.of('/channels').to(userRoom).emit('channel:invited', payload)
  }
}
