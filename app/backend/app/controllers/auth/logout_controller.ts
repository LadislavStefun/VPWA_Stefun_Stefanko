import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutController {
  async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.noContent()
  }
}
