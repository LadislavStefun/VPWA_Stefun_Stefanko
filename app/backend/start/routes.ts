/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('health', async () => {
  return { status: 'OK' }
})

router.get('/', async () => {
  return {
    hello: 'TEST :D was here',
  }
})
