export interface Message {
    id: string
    channelId: string
    userId: string
    name: string
    text: string[]
    typing?: boolean
    tagged?: boolean
    sent?: boolean
}