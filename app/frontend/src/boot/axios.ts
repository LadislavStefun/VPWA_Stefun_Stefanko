import { boot } from 'quasar/wrappers'
import axios from 'axios'
import authManager from 'src/services/authManager'
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})


api.interceptors.request.use((config) => {
  const token= authManager.getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})
