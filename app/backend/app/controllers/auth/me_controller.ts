import type { HttpContext } from '@adonisjs/core/http'

export default class MeController {
  async me({ auth }: HttpContext) {
    await auth.check()

    return {
      user: auth.user
        ? {
            id: auth.user.id,
            firstName: auth.user.firstName,
            lastName: auth.user.lastName,
            email: auth.user.email,
            nickName: auth.user.nickName,
          }
        : null,
    }
  }
}
