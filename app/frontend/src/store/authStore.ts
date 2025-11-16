import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const isAuthenticated = ref(false)

    function setUser(userData: User) {
        user.value = userData
    }

    async function logout() {
        await api.post('/logout')
        user.value = null
    }

    return {
        user,
        isAuthenticated,

        setUser,
        logout
    }

})