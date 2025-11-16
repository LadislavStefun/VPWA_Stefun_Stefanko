/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const RegisterController = () => import('#controllers/auth/register_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const MeController = () => import('#controllers/auth/me_controller')
const ChannelsController = () => import('#controllers/channels_controller')

router.get('health', async () => {
  return { status: 'OK' }
})

router.post('/register', [RegisterController, 'register'])
router.post('/login', [LoginController, 'login'])

router.post('/logout', [LogoutController, 'logout']).use(middleware.auth({ guards: ['web'] }))
router.get('/me', [MeController, 'me']).use(middleware.auth({ guards: ['web'] }))

router.post('/channels', [ChannelsController, 'store']).use(middleware.auth({ guards: ['web'] }))
router.get('/me/channels', [ChannelsController, 'index']).use(middleware.auth({ guards: ['web'] }))
router.post('/channels/join-by-name', [ChannelsController, 'joinByName']).use(middleware.auth({ guards: ['web'] }))
router.post('/channels/:id/invite', [ChannelsController, 'invite']).use(middleware.auth({ guards: ['web'] }))
router.post('/channels/:id/revoke', [ChannelsController, 'revoke']).use(middleware.auth({ guards: ['web'] }))

