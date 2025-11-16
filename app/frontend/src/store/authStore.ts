import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const isInitialized = ref(false)


    const isAuthenticated = computed(() => {
        return user.value !== null
    })


    const fetchUser = async () => {
        if (isInitialized.value) {
            return user.value
        }

        try {
            const response = await api.get('/me')
            setUser(response.data.user)
        } catch {
            user.value = null
        } finally {
            isInitialized.value = true
        }

        return user.value
    }


    const setUser = (userData: User | null) => {
        user.value = userData
        if (!isInitialized.value) {
            isInitialized.value = true
        }
    }

    const logout = async () => {
        await api.post('/logout')
        user.value = null
        isInitialized.value = true
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
