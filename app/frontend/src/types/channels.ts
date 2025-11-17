export type ChannelType = 'public' | 'private'

export interface Channel{
    id: string
    name : string
    type : ChannelType
    isNew : boolean
    isActive : boolean
    isInvited: boolean

}
