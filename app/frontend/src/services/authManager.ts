import { LocalStorage } from 'quasar'
type ChangeListener = (newToken: string | null, oldToken: string | null) => void


class AuthManager {
    private storageKey = 'auth_token'
    private currentToken: string | null = this.getToken()
    private listeners: ChangeListener[] = []

    constructor() {
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.notifyListeners()
            }
        })
    }

    private notifyListeners() {
        const newToken = this.getToken()
        if (newToken === this.currentToken) return
        this.listeners.forEach((fn) => fn(newToken, this.currentToken))
        this.currentToken = newToken
    }

    onChange(listener: ChangeListener) {
        this.listeners.push(listener)
        if (this.currentToken !== null) setTimeout(() => listener(this.currentToken, null), 0)
        return () => {
            const idx = this.listeners.indexOf(listener)
            if (idx >= 0) this.listeners.splice(idx, 1)
        }
    } onLogout(listener: () => void) {
        return this.onChange((token) => token === null && listener())
    }

    getToken() {
        return LocalStorage.getItem<string>(this.storageKey)
    }

    setToken(token: string) {
        LocalStorage.set(this.storageKey, token)
        this.notifyListeners()
    }

    removeToken() {
        LocalStorage.remove(this.storageKey)
        this.notifyListeners()
    }

    logout() {
        this.removeToken()
    }
}

export default new AuthManager()