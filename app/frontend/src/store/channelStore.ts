import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Channel, ChannelType } from '../types'
import { api } from 'src/boot/axios'

type BackendChannel = {
  id: number
  name: string
  isPrivate: boolean
  ownerId: number
  membershipStatus: 'active' | 'invited' | 'left' | 'revoked' | 'banned' | 'declined'
}

function mapBackendChannel(bc: BackendChannel): Channel {
  const isInvited = bc.membershipStatus === 'invited'

  return {
    id: String(bc.id),
    name: bc.name,
    type: bc.isPrivate ? 'private' : 'public',
    isActive: false,
    isNew: isInvited,
    isInvited,
  }
}

export const useChannelsStore = defineStore('channels', () => {

    const channels = ref<Channel[]>([])
    const activeChannelId = ref<string | null>(null)

    const activeChannel = computed(() =>
        channels.value.find(ch => ch.id === activeChannelId.value)
    )

    const publicChannels = computed(() =>
        channels.value.filter(ch => ch.type === 'public')
    )

    const privateChannels = computed(() =>
        channels.value.filter(ch => ch.type === 'private')
    )


    const setActiveChannel = (channelId: string) => {
        if (activeChannel.value) {
            const prevChannel = channels.value.find(ch => ch.id === activeChannelId.value)
            if (prevChannel) prevChannel.isActive = false

        }
        activeChannelId.value = channelId
        const channel = channels.value.find(ch => ch.id === channelId)
        if (channel) {
            channel.isActive = true;
        }

    }

    const setNewChannel = (channelId: string) => {
        channels.value.forEach(channel => {
            channel.isNew = false
        })

        const channel = channels.value.find(ch => ch.id == channelId)
        if (channel) {
            channel.isNew = true
        }
    }

    const deleteChannel = (channelId: string) => {
        channels.value = channels.value.filter((ch) => ch.id !== channelId)
    }

    const loadChannels = async () => {
    const res = await api.get<BackendChannel[]>('/me/channels')
    const backendChannels = res.data
    const mapped = backendChannels.map(mapBackendChannel)
    channels.value = mapped

    const firstChannel = channels.value[0]
    if (firstChannel) {
      setActiveChannel(firstChannel.id)
    }
    }

    const addChannel = async (name: string, type: ChannelType) => {
    const isPrivate = type === 'private'

    const res = await api.post<BackendChannel>('/channels', { name, isPrivate })
    const backendChannel = res.data

    const newChannel = mapBackendChannel(backendChannel)
    channels.value = [...channels.value, newChannel]
    setActiveChannel(newChannel.id)
    }

    const joinOrCreateChannelByName = async (name: string, type: ChannelType = 'public') => {
      const isPrivate = type === 'private'

    const res = await api.post<BackendChannel>('/channels/join-by-name', {name, isPrivate,})
    const backendChannel = res.data

    const channelId = String(backendChannel.id)
    const existing = channels.value.find((ch) => ch.id === channelId)

    if (existing) {
    existing.isActive = true
    existing.isNew = false
    existing.isInvited = false

    setActiveChannel(existing.id)
    return existing
    }

    const joinedChannel = mapBackendChannel(backendChannel)

    channels.value.push(joinedChannel)
    setActiveChannel(joinedChannel.id)
    return joinedChannel
  }

  const inviteUserToActiveChannel = async (nickName: string) => {
  const current = activeChannel.value
  if (!current) {
    throw new Error('No active channel selected')
  }

  await api.post(`/channels/${current.id}/invite`, { nickName })
  }
  const kickUserFromActiveChannel = async (nickName: string) => {
  const current = activeChannel.value
  if (!current) {
    throw new Error('No active channel selected')
  }

  const res = await api.post(`/channels/${current.id}/kick`, { nickName })
  return res.data 
  }

  const revokeUserFromActiveChannel = async (nickName: string) => {
  const current = activeChannel.value
  if (!current) {
    throw new Error('No active channel selected')
  }

  await api.post(`/channels/${current.id}/revoke`, { nickName })
  }

  const quitActiveChannel = async () => {
  const current = activeChannel.value
  if (!current) {
    throw new Error('No active channel selected')
  }

  await api.post(`/channels/${current.id}/quit`)

  const remaining = channels.value.filter((ch) => ch.id !== current.id)
  channels.value = remaining

  if (activeChannelId.value === current.id) {
    activeChannelId.value = remaining[0]?.id ?? null
  }
  }
  const cancelMembershipInActiveChannel = async () => {
  const current = activeChannel.value
  if (!current) {
    throw new Error('No active channel selected')
  }

  await api.post(`/channels/${current.id}/cancel`)

  const remaining = channels.value.filter((ch) => ch.id !== current.id)
  channels.value = remaining

  if (activeChannelId.value === current.id) {
    activeChannelId.value = remaining[0]?.id ?? null
  }
  }
  const declineInvite = async (channelId: string | number) => {
    await api.post(`/channels/${channelId}/decline`)
  }
    return {
        channels,
        activeChannelId,

        activeChannel,
        publicChannels,
        privateChannels,

        setActiveChannel,
        setNewChannel,
        addChannel,
        deleteChannel,
        loadChannels,
        joinOrCreateChannelByName,
        inviteUserToActiveChannel,
        revokeUserFromActiveChannel,
        kickUserFromActiveChannel,
        quitActiveChannel,
        cancelMembershipInActiveChannel,
        declineInvite,
    }

})
