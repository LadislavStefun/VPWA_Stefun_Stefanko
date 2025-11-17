import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, hasMany } from '@adonisjs/lucid/orm'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import UserPreference from './user_preference.js'
import ChannelMembership from './channel_membership.js'
import Channel from '#models/channel'
import Message from '#models/message'
import KickVote from '#models/kick_vote'
import AuditLog from '#models/audit_log'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

//https://docs.adonisjs.com/guides/authentication/verifying-user-credentials
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'passwordHash',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    table: 'auth_access_tokens',
  })
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column({ columnName: 'nick_name' })
  declare nickName: string

  @column()
  declare email: string

  @column()
  declare passwordHash: string

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare lastSeenAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime()
  declare updatedAt: DateTime

  @hasOne(() => UserPreference)
  declare preferences: HasOne<typeof UserPreference>

  @hasMany(() => ChannelMembership)
  declare memberships: HasMany<typeof ChannelMembership>

  @hasMany(() => Channel, {
    foreignKey: 'ownerId',
  })
  declare ownedChannels: HasMany<typeof Channel>

  @hasMany(() => Message, {
    foreignKey: 'authorId',
  })
  declare messages: HasMany<typeof Message>

  @hasMany(() => KickVote, {
    foreignKey: 'voterUserId',
  })
  declare givenKickVotes: HasMany<typeof KickVote>

  @hasMany(() => KickVote, {
    foreignKey: 'targetUserId',
  })
  declare receivedKickVotes: HasMany<typeof KickVote>

  @hasMany(() => AuditLog, {
    foreignKey: 'actorId',
  })
  declare auditLogsAsActor: HasMany<typeof AuditLog>

  @hasMany(() => AuditLog, {
    foreignKey: 'targetUserId',
  })
  declare auditLogsAsTarget: HasMany<typeof AuditLog>
}
