import vine from '@vinejs/vine'

export const createChannelValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(50),
    isPrivate: vine.boolean().optional(),
  })
)
export const joinByNameValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(50),
    isPrivate: vine.boolean().optional(),
  })
)
export const nickNameValidator = vine.compile(
  vine.object({
    nickName: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(50),
  })
)
