<template>
  <div class="chat-box q-pa-md">
    <q-scroll-area ref="scrollAreaRef" class="fit shadow-1 q-pa-md">
      <q-banner v-if="activeNotice" class="text-black q-pa-sm q-mb-sm" dense>
        {{ activeNotice }}
      </q-banner>
      <q-infinite-scroll
        ref="infiniteRef"
        reverse
        :scroll-target="scrollTarget"
        @load="onLoad"
        class="q-pr-md"
      >
        <div v-for="message in messages" :key="message.id" class="caption">
          <ChatMessage
            :name="message.name"
            :text="message.text"
            :sent="message.sent || false"
            :typing="message.typing || false"
            :tagged="message.tagged || false"
          />
        </div>
        <template #loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { QInfiniteScroll, QScrollArea } from 'quasar'
import ChatMessage from 'src/components/Chat/ChatMessage.vue'
import { useMessagesStore } from 'src/store/messageStore'
import { useChannelsStore } from 'src/store/channelStore'
import channelSocketManager from 'src/services/ChannelSocketManager'
import { useQuasar } from "quasar";

const messagesStore = useMessagesStore()
const channelsStore = useChannelsStore()

const messages = computed(() => messagesStore.activeChannelMessages)
const activeNotice = computed(() => messagesStore.activeChannelNotice)

const infiniteRef = ref<QInfiniteScroll | null>(null)
const scrollAreaRef = ref<QScrollArea | null>(null)
const scrollTarget = ref<Element | undefined>()
const hasMore = ref(true)
const isLoading = ref(false)
const pageSize = 50
const quasar = useQuasar();


const updateScrollTarget = async () => {
  await nextTick()
  scrollTarget.value = scrollAreaRef.value?.getScrollTarget()
}

const resetInfinite = async () => {
  hasMore.value = true
  isLoading.value = false
  await updateScrollTarget()
  infiniteRef.value?.reset()
  infiniteRef.value?.resume()
}

watch(
  () => channelsStore.activeChannelId,
  () => {
    void resetInfinite()
  }
)

onMounted(() => {
  void updateScrollTarget()
})

const onLoad = async (_index: number, done: (stop?: boolean) => void) => {
  if (isLoading.value) {
    done()
    return
  }
  if (!hasMore.value) {
    done(true)
    return
  }

  const activeChannelId = channelsStore.activeChannelId
  if (!activeChannelId) {
    done(true)
    return
  }

  const currentMessages = messages.value
  const oldest = currentMessages[0]

  if (!oldest?.id) {
    done()
    return
  }

  const beforeId = Number(oldest.id)

  isLoading.value = true
  try {
    const fetched = await channelSocketManager.fetchHistory({
      channelId: Number(activeChannelId),
      beforeId,
      limit: pageSize,
    })

    if (fetched.length === 0) {
      hasMore.value = false
      done(true)
    } else {
      messagesStore.prependHistory(activeChannelId, fetched)
      if (fetched.length < pageSize) {
        hasMore.value = false
        done(true)
      } else {
        done()
      }
    }
  } catch (error) {
     quasar.notify({
        type: 'negative',
        message: error instanceof Error ? error.message : 'Failed to load messages',
      })
    done(true)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.chat-box {
  height: 100%;
  width: 100%;
  min-height: 0;
}
</style>
