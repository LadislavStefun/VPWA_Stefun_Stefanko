import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Channel, ChannelType } from '../types'
import { api } from 'src/boot/axios'

type BackendChannel = {
  id: number
  name: string
  isPrivate: boolean
  ownerId: number
}

function mapBackendChannel(bc: BackendChannel): Channel {
  return {
    id: String(bc.id),
    name: bc.name,
    type: bc.isPrivate ? 'private' : 'public',
    isActive: false,
    isNew: false,
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
    newChannel.isNew = true

    channels.value = [...channels.value, newChannel]
    setActiveChannel(newChannel.id)
    setNewChannel(newChannel.id)
    }

    const joinOrCreateChannelByName = async (name: string, type: ChannelType = 'public') => {
    const isPrivate = type === 'private'

    const res = await api.post<BackendChannel>('/channels/join-by-name', {
      name,
      isPrivate,
    })

    const backendChannel = res.data
    const joinedChannel = mapBackendChannel(backendChannel)

    const existing = channels.value.find(
      (ch) => ch.id === joinedChannel.id.toString()
    )

    if (existing) {
      setActiveChannel(existing.id)
      setNewChannel(existing.id)
      return existing
    }

    joinedChannel.isNew = true
    channels.value.push(joinedChannel)
    setActiveChannel(joinedChannel.id)
    setNewChannel(joinedChannel.id)

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
  return res.data // očakávame { message: string }
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
    }

})
