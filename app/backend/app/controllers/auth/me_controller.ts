import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class MeController {
  async me({ auth }: HttpContext) {
    const user = (await auth.authenticate()) as unknown as User

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        nickName: user.nickName,
      },
    }
  }
}
