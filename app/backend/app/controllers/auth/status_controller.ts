import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { updateStatusValidator } from '#validators/user_status'

export default class StatusController {
  async update({ auth, request }: HttpContext) {
    const user = (await auth.authenticate()) as unknown as User
    const { status } = await request.validateUsing(updateStatusValidator)

    user.status = status
    await user.save()

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        nickName: user.nickName,
        status: user.status,
      },
    }
  }
}
