import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(1).maxLength(50),
    lastName: vine.string().minLength(1).maxLength(50),
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .unique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8),
    nickName: vine.string().minLength(1).maxLength(20).unique({
      table: 'users',
      column: 'nick_name',
    }),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().minLength(8),
  })
)
