export type ChannelType = 'public' | 'private'

export interface Channel{
    id: string
    name : string
    isPrivate : boolean
    type : ChannelType
    isNew : boolean
    isActive : boolean
}