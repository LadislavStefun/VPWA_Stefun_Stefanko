import { configApp } from '@adonisjs/eslint-config'

export default configApp({
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
