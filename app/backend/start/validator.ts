import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { messages, fields } from '@vinejs/vine/defaults'

vine.messagesProvider = new SimpleMessagesProvider(
  {
    ...messages,
    'email.database.unique': 'The email address has already been used',
    'nickName.database.unique': 'The nickname has already been used',
  },
  fields
)
