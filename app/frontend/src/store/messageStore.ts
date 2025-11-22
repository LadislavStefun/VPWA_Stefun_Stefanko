import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AppVisibility } from 'quasar'
import { useChannelsStore } from './channelStore'
import { useAuthStore } from './authStore'
import type { Message } from 'src/types'
import { usePreferencesStore } from './preferencesStore'

export const useMessagesStore = defineStore('messages', () => {
  const messagesByChannel = ref<Record<string, Message[]>>({})

  const channelsStore = useChannelsStore()
  const authStore = useAuthStore()
  const preferencesStore = usePreferencesStore()

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

  async function ensureNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      return false
    }

    const result = await Notification.requestPermission()
    return result === 'granted'
  }

  async function showMessageNotification(
  channelId: number | string,
  message: Message
  ) {
  if (AppVisibility.appVisible === true) {
    return
  }
  const myId = authStore.user?.id
  if (String(message.userId) === String(myId)) {
      return
  }

  if (!(await ensureNotificationPermission())) {
    return
  }

  if (preferencesStore.notifyMentionsOnly && !message.tagged) {
    return
  }

  const channel = channelsStore.channels.find(
    (ch) => ch.id === String(channelId)
  )
  if (!channel) {
    return
  }

  const channelTitle = channel ? `${channel.name}` : 'New message'

  const sender = message.name || 'Unknown user'

  const rawText = Array.isArray(message.text) ? message.text.join(' ') : String(message.text ?? '')
  const snippet = rawText.length > 50 ? rawText.slice(0, 47) + '…' : rawText

  new Notification(channelTitle, {
    body: `${sender}: ${snippet}`,
  })
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
    void showMessageNotification(channelId, message)
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
