import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'sqlite',
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
  },
})

export default dbConfig
