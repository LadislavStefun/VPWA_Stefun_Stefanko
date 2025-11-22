import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export const usePreferencesStore = defineStore('preferences', () => {
  const notifyMentionsOnly = ref(false)
  const loaded = ref(false)

  const loadPreferences = async () => {
    const res = await api.get<{ notifyMentionsOnly: boolean }>('/me/preferences')
    notifyMentionsOnly.value = !!res.data.notifyMentionsOnly
    loaded.value = true
  }

  const savePreferences = async () => {
    await api.put('/me/preferences', {
      notifyMentionsOnly: notifyMentionsOnly.value,
    })
  }

  return {
    notifyMentionsOnly,
    loaded,
    loadPreferences,
    savePreferences,
  }
})
