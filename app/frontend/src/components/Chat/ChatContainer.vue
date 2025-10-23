<template>
  <div class="chat-box q-pa-md">
    <q-scroll-area class="fit shadow-1 q-pa-md">
      <q-infinite-scroll @load="onLoad" reverse class="q-pr-md">
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

        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>

        <div
          v-for="(item, index) in items"
          :key="`mock-${index}`"
          class="caption q-py-sm"
        >
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
        </div> </q-infinite-scroll
    ></q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import ChatMessage from 'src/components/Chat/ChatMessage.vue'
import { useMessagesStore } from 'src/store/messageStore'

const messagesStore = useMessagesStore()
const items: Ref<Record<string, unknown>[]> = ref([{}, {}, {}, {}])

const onLoad = (index: number, done: () => void) => {
  setTimeout(() => {
    items.value.push({}, {}, {})
    done()
  }, 2000)
}
</script>

<style scoped>
.chat-box {
  height: 100%;
  width: 100%;
  min-height: 0;
}
</style>
