import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useChannelsStore } from './channelStore'
import type { Message } from 'src/types'

export const useMessagesStore = defineStore('messages', () => {
  const messagesByChannel = ref<Record<string, Message[]>>({})

  const channelsStore = useChannelsStore()

  const activeChannelMessages = computed(() => {
    const activeId = channelsStore.activeChannelId
    if (!activeId) {
      return []
    }

    return messagesByChannel.value[activeId] ?? []
  })

  function setHistory(channelId: number | string, list: Message[]) {
    messagesByChannel.value[String(channelId)] = [...list]
  }

  function addMessage(channelId: number | string, message: Message) {
    const key = String(channelId)
    if (!messagesByChannel.value[key]) {
      messagesByChannel.value[key] = []
    }

    const existingIndex = messagesByChannel.value[key].findIndex((msg) => msg.id === message.id)
    if (existingIndex !== -1) {
      messagesByChannel.value[key][existingIndex] = message
      return
    }

    messagesByChannel.value[key].push(message)
  }

  function clearChannel(channelId: string | number) {
    delete messagesByChannel.value[String(channelId)]
  }

  function getMessagesByChannel(channelId: string) {
    return computed(() => messagesByChannel.value[channelId] ?? [])
  }

  return {
    messagesByChannel,
    activeChannelMessages,
    setHistory,
    addMessage,
    clearChannel,
    getMessagesByChannel,
  }
})
