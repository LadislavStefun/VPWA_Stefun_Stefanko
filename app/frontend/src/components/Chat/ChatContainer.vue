<template>
  <div class="chat-box q-pa-md">
    <q-scroll-area class="fit shadow-1 q-pa-md">
      <q-banner
      v-if="activeNotice"
      class="text-black q-pa-sm q-mb-sm"
      dense
    >
      {{ activeNotice }}
    </q-banner>
      <div
        v-for="message in messagesStore.activeChannelMessages"
        :key="message.id"
        class="caption"
      >
        <ChatMessage
          :name="message.name"
          :text="message.text"
          :sent="message.sent || false"
          :typing="message.typing || false"
          :tagged="message.tagged || false"
        />
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChatMessage from 'src/components/Chat/ChatMessage.vue'
import { useMessagesStore } from 'src/store/messageStore'

const messagesStore = useMessagesStore()
const activeNotice = computed(() => messagesStore.activeChannelNotice)
</script>

<style scoped>
.chat-box {
  height: 100%;
  width: 100%;
  min-height: 0;
}
</style>
