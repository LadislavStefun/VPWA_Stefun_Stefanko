import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import ChannelMembership from '#models/channel_membership'
import Message from '#models/message'
import KickVote from '#models/kick_vote'
import AuditLog from '#models/audit_log'

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({ columnName: 'is_private' })
  declare isPrivate: boolean

  @column({ columnName: 'owner_id' })
  declare ownerId: number

  @column.dateTime({ columnName: 'deleted_at' })
  declare deletedAt: DateTime | null

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'closed_at' })
  declare closedAt: DateTime | null

  @column.dateTime({ columnName: 'last_activity_at' })
  declare lastActivityAt: DateTime | null

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => ChannelMembership)
  declare memberships: HasMany<typeof ChannelMembership>

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  @hasMany(() => KickVote)
  declare kickVotes: HasMany<typeof KickVote>

  @hasMany(() => AuditLog)
  declare auditLogs: HasMany<typeof AuditLog>

  public isExpired(now: DateTime = DateTime.now()): boolean {
    const reference = this.lastActivityAt ?? this.createdAt
    if (!reference) {
      return false
    }
    const limit = now.minus({ days: 30 })
    return reference < limit
  }
}
