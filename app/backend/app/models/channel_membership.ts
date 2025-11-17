import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import Channel from '#models/channel'

export default class ChannelMembership extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'channel_id' })
  declare channelId: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column()
  declare role: string

  @column()
  declare status: string

  @column({ columnName: 'invited_by_id' })
  declare invitedById: number | null

  @column.dateTime({ columnName: 'invited_at' })
  declare invitedAt: DateTime | null

  @column.dateTime({ columnName: 'joined_at' })
  declare joinedAt: DateTime | null

  @column.dateTime({ columnName: 'left_at' })
  declare leftAt: DateTime | null

  @column.dateTime({ columnName: 'revoked_at' })
  declare revokedAt: DateTime | null

  @column.dateTime({ columnName: 'banned_at' })
  declare bannedAt: DateTime | null

  @column({ columnName: 'ban_reason' })
  declare banReason: string | null

  @belongsTo(() => Channel)
  declare channel: BelongsTo<typeof Channel>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'invitedById' })
  declare invitedBy: BelongsTo<typeof User>
}
