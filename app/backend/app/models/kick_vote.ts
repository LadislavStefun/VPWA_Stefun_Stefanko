import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import Channel from '#models/channel'
import User from '#models/user'

export default class KickVote extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'channel_id' })
  declare channelId: number

  @column({ columnName: 'target_user_id' })
  declare targetUserId: number

  @column({ columnName: 'voter_user_id' })
  declare voterUserId: number

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Channel)
  declare channel: BelongsTo<typeof Channel>

  @belongsTo(() => User, { foreignKey: 'targetUserId' })
  declare targetUser: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'voterUserId' })
  declare voterUser: BelongsTo<typeof User>
}
