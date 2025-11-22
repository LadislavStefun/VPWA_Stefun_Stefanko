import vine from '@vinejs/vine'

export const updatePreferencesValidator = vine.compile(
  vine.object({
    notifyMentionsOnly: vine.boolean(),
  })
)
