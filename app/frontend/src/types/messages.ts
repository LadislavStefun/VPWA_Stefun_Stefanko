export interface Message {
    id: string
    channelId: string
    userId: string
    name: string
    text: string[]
    mentions: { id: number; nickName: string }[]
    createdAt?: string
    typing?: boolean
    tagged?: boolean
    sent?: boolean
}
