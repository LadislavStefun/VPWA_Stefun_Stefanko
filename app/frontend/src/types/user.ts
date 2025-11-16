export type UserStatus = "online" | "offline" | "dnd"

export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    nickName: string
    status?: UserStatus
}

export interface ChatUser {
    id: string
    nickname: string
    status: UserStatus
}

export interface CurrentUser extends User {
    preferences: UserPreferences
    channels: string[]
}

export interface UserPreferences {
    notifications: boolean
}

export interface ChannelMember extends ChatUser {
    role: 'admin' | 'member'
}