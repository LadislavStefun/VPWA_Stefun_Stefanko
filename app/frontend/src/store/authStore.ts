import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import type { User } from '../types'
import authManager from 'src/services/authManager'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const isInitialized = ref(false)


    const isAuthenticated = computed(() => {
        return user.value !== null
    })


    const setUser = (data: User | null) => {
        user.value = data
        if (!isInitialized.value) {
            isInitialized.value = true
        }
    }

    const fetchUser = async () => {
        if (isInitialized.value) return user.value

        const token = authManager.getToken()
        if (!token) {
            setUser(null)
            return null
        }

        try {
            const response = await api.get('/me')
            setUser(response.data.user)
        } catch {
            setUser(null)
        }

        return user.value
    }

    const logout = async () => {
        await api.post('/logout')
        user.value = null
        authManager.logout()
        setUser(null)
    }

    return {
        user,
        isInitialized,
        isAuthenticated,

        fetchUser,
        setUser,
        logout
    }

})
