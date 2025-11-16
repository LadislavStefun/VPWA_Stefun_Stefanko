import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: env.get('DB_CONNECTION'),
  connections: {
    sqlite: {
      client: 'sqlite3',
      connection: {
        filename: './database/dev.sqlite3',
      },
      migrations: {
        naturalSort: true,
      },
      useNullAsDefault: true,
    },
    pg: {
      client: 'pg',
      connection: env.get('DB_CONNECTION_STRING'),
      migrations: {
        naturalSort: true,
      },
    },
  },
})

export default dbConfig
