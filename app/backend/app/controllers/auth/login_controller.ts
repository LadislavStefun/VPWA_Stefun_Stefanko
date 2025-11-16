import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/auth'

import User from '#models/user'

export default class LoginController {
  async login({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        nickName: user.nickName,
      },
    }
  }
}
