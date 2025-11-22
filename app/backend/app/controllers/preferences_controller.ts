import type { HttpContext } from '@adonisjs/core/http'
import UserPreference from '#models/user_preference'
import { updatePreferencesValidator } from '#validators/user_preferences'

export default class PreferencesController {
  public async show({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized()
    }

    let prefs = await UserPreference.find(user.id)

    if (!prefs) {
      prefs = await UserPreference.create({
        userId: user.id,
        notifyMentionsOnly: false,
      })
    }

    return {
      notifyMentionsOnly: prefs.notifyMentionsOnly,
    }
  }

  public async update({ auth, request, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized()
    }

    const payload = await request.validateUsing(updatePreferencesValidator)

    let prefs = await UserPreference.find(user.id)
    if (!prefs) {
      prefs = new UserPreference()
      prefs.userId = user.id
    }

    prefs.notifyMentionsOnly = payload.notifyMentionsOnly
    await prefs.save()

    return {
      notifyMentionsOnly: prefs.notifyMentionsOnly,
    }
  }
}

