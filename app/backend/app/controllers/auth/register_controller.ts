import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/auth'

export default class RegisterController {
  async register({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      nickName: payload.nickName,
      email: payload.email,
      passwordHash: payload.password,
      status: 'active',
    })

    const token = await auth.use('api').createToken(user, ['*'], { expiresIn: '7d' })

    return response.created({
      token: token.value!.release(),
      expiresAt: token.expiresAt,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        nickName: user.nickName,
      },
    })
  }
}
