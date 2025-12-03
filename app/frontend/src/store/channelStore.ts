import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Channel, ChannelType } from '../types'
import ChannelSocketManager from 'src/services/ChannelSocketManager'
import { useMessagesStore } from './messageStore'

type BackendChannel = {
  id: number
  name: string
  isPrivate: boolean
  ownerId: number
  membershipStatus?: 'active' | 'invited' | 'left' | 'revoked' | 'banned' | 'declined'
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
    ownerId: String(bc.ownerId),
  }
}

export const useChannelsStore = defineStore('channels', () => {

  const channels = ref<Channel[]>([])
  const activeChannelId = ref<string | null>(null)
  const isLoaded = ref(false)
  const messagesStore = useMessagesStore()

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
      channel.isActive = true
      if (channel.isInvited) {
        messagesStore.clearChannel(channelId)
        messagesStore.setChannelNotice(channelId, 'You must accept the invite before you can view this channel')
        return
      }
      messagesStore.setChannelNotice(channelId, null)
      
      ChannelSocketManager.join(parseInt(channelId))
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


  const loadChannels = async () => {
    if (isLoaded.value) {
      return
    }
    await ChannelSocketManager.waitUntilReady()
    const backendChannels = await ChannelSocketManager.fetchChannels()
    const mapped = backendChannels.map(mapBackendChannel)
    channels.value = mapped
    isLoaded.value = true

    const firstChannel = channels.value[0]
    if (firstChannel) {
      setActiveChannel(firstChannel.id)
    }
  }

  const addChannel = async (name: string, type: ChannelType) => {
    const isPrivate = type === 'private'

    const backendChannel = await ChannelSocketManager.createChannel(name, isPrivate)

    const newChannel = mapBackendChannel(backendChannel)
    channels.value = [...channels.value, newChannel]
    setActiveChannel(newChannel.id)
  }

  const joinOrCreateChannelByName = async (name: string, type: ChannelType = 'public') => {
    const isPrivate = type === 'private'

    const backendChannel = await ChannelSocketManager.joinChannelByName(name, isPrivate)

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

    await ChannelSocketManager.inviteUser(Number(current.id), nickName)
  }
  const kickUserFromActiveChannel = async (nickName: string) => {
    const current = activeChannel.value
    if (!current) {
      throw new Error('No active channel selected')
    }

    const res = await ChannelSocketManager.kickUser(Number(current.id), nickName)
    return res
  }

  const revokeUserFromActiveChannel = async (nickName: string) => {
    const current = activeChannel.value
    if (!current) {
      throw new Error('No active channel selected')
    }

    await ChannelSocketManager.revokeUser(Number(current.id), nickName)
  }

  const quitActiveChannel = async () => {
    const current = activeChannel.value
    if (!current) {
      throw new Error('No active channel selected')
    }

    await ChannelSocketManager.quitChannel(Number(current.id))

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

    await ChannelSocketManager.cancelMembership(Number(current.id))

    const remaining = channels.value.filter((ch) => ch.id !== current.id)
    channels.value = remaining

    if (activeChannelId.value === current.id) {
      activeChannelId.value = remaining[0]?.id ?? null
    }
  }
  const declineInvite = async (channelId: string | number) => {
    await ChannelSocketManager.declineInvite(Number(channelId))
  }

  const handleMembershipUpdate = (backendChannel: BackendChannel) => {
    const status = backendChannel.membershipStatus
    const channelId = String(backendChannel.id)

    if (status && status !== 'active' && status !== 'invited') {
      channels.value = channels.value.filter((ch) => ch.id !== channelId)
      messagesStore.clearChannel(channelId)
      if (activeChannelId.value === channelId) {
        activeChannelId.value = channels.value[0]?.id ?? null
      }
      return null
    }

    const updated = upsertChannelFromSocket(backendChannel)

    if (status === 'invited') {
      messagesStore.clearChannel(channelId)
      messagesStore.setChannelNotice(channelId, 'You must accept the invite before you can view this channel')
      if (activeChannelId.value === channelId) {
        updated.isActive = false
        activeChannelId.value = null
      }
    } else {
      messagesStore.setChannelNotice(channelId, null)
    }

    return updated
  }

  const upsertChannelFromSocket = (backendChannel: BackendChannel) => {
    const mapped = mapBackendChannel(backendChannel)
    const existingIndex = channels.value.findIndex((ch) => ch.id === mapped.id)

    if (existingIndex !== -1) {
      channels.value[existingIndex] = {
        ...channels.value[existingIndex],
        ...mapped,
      }
      return channels.value[existingIndex]
    }

    channels.value.push(mapped)
    return mapped
  }

  const reset = () => {
    channels.value = []
    activeChannelId.value = null
    isLoaded.value = false
    messagesStore.reset()
  }

  const quitChannel = async (channelId: string) => {
    await ChannelSocketManager.quitChannel(Number(channelId))

    channels.value = channels.value.filter((ch) => ch.id !== channelId)

    if (activeChannelId.value === channelId) {
      const first = channels.value[0]
      activeChannelId.value = first ? first.id : null
    }
  }

  const leaveChannel = async (channelId: string) => {
    await ChannelSocketManager.cancelMembership(Number(channelId))

    channels.value = channels.value.filter((ch) => ch.id !== channelId)

    if (activeChannelId.value === channelId) {
      const first = channels.value[0]
      activeChannelId.value = first ? first.id : null
    }
  }

  const sendMessage = (content: string) => {
    if (!activeChannelId.value) {
      throw new Error('No active channel selected')
    }
    ChannelSocketManager.sendMessage(parseInt(activeChannelId.value), content)
  }

  const sendTyping = (isTyping: boolean) => {
    if (!activeChannelId.value) return
    ChannelSocketManager.sendTyping(parseInt(activeChannelId.value), isTyping)
  }

  return {
    channels,
    activeChannelId,

    activeChannel,
    publicChannels,
    privateChannels,

    setActiveChannel,
    setNewChannel,
    upsertChannelFromSocket,
    handleMembershipUpdate,
    addChannel,
    loadChannels,
    reset,
    joinOrCreateChannelByName,
    inviteUserToActiveChannel,
    revokeUserFromActiveChannel,
    kickUserFromActiveChannel,
    quitActiveChannel,
    cancelMembershipInActiveChannel,
    declineInvite,
    quitChannel,
    leaveChannel,
    sendMessage,
    sendTyping,
  }

})
