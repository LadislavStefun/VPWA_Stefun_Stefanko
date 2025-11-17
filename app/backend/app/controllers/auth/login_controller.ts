import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/auth'

import User from '#models/user'

export default class LoginController {
  async login({ request, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await auth.use('api').createToken(user, ['*'], { expiresIn: '7d' })
    return {
      token: token.value?.release(),
      expiresAt: token.expiresAt,
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
