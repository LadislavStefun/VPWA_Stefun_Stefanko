import vine from '@vinejs/vine'

export const updateStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(['online', 'offline', 'dnd']),
  })
)
