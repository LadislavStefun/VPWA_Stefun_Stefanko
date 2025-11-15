import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import Channel from '#models/channel'

export default class AuditLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare actorId: number

  @column()
  declare channelId: number | null

  @column()
  declare targetUserId: number | null

  @column()
  declare action: string

  @column.dateTime()
  declare createdAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'actorId',
  })
  declare actor: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'targetUserId',
  })
  declare targetUser: BelongsTo<typeof User>

  @belongsTo(() => Channel)
  declare channel: BelongsTo<typeof Channel>
}
