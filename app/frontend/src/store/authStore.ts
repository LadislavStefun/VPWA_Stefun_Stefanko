import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import type { User, UserStatus } from '../types'
import authManager from 'src/services/authManager'
import ChannelSocketManager from 'src/services/ChannelSocketManager'

export type { UserStatus }


export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const isInitialized = ref(false)

    const userStatus = ref<UserStatus>('online')

    const isAuthenticated = computed(() => {
        return user.value !== null
    })


    const setUser = (data: User | null) => {
        user.value = data
        if (data?.status) {
            userStatus.value = data.status
        }
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

    const setStatus = async (status: UserStatus) => {
        const previousStatus = userStatus.value
        userStatus.value = status
        if (user.value) {
            user.value.status = status
        }

        if (!user.value) return

        try {
            await api.put('/me/status', { status })
        } catch (error) {
            console.error('Failed to update status', error)
        }

        if (status === 'offline') {
            ChannelSocketManager.goOffline()
        } else if (previousStatus === 'offline') {
            void ChannelSocketManager.goOnline()
        }
    }

    return {
        user,
        isInitialized,
        isAuthenticated,
        userStatus,
        setStatus,
        fetchUser,
        setUser,
        logout
    }

})
