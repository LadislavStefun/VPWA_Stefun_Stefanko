<template>
  <div class="input-bar">
    <q-input
      filled
      v-model="text"
      :dense="dense"
      placeholder="Say something..."
      style="width: 100%;"
      @keyup.enter="submit"
    />
    <q-btn
      color="primary"
      round
      class="q-ml-md"
      unelevated
      icon="send"
      @click="submit"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { useChannelsStore } from "src/store/channelStore";

const text = ref("");

const emit = defineEmits<{
  (e: "command", cmd: string, args: string[]): void;
  (e: "message", message: string): void;
  (e: "testnotify"): void;
}>();

const channelsStore = useChannelsStore();
let typingTimeout: ReturnType<typeof setTimeout> | null = null;

const sendTyping = (isTyping: boolean) => {
  try {
    const content = isTyping ? text.value.slice(0, 300) : undefined;
    channelsStore.sendTyping(isTyping, content);
  } catch (error) {
    console.error('Failed to send typing status', error);
  }
};

watch(
  () => text.value,
  (val) => {
    if (!channelsStore.activeChannelId) return;
    const trimmed = val.trim();

    if (trimmed.length === 0) {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
      }
      sendTyping(false);
      return;
    }

    sendTyping(true);
    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      sendTyping(false);
      typingTimeout = null;
    }, 2000);
  }
);

function submit() {
  const originalText = text.value;
  const v = originalText.trim();

  if (v.startsWith("/")) {
    const parts = v.slice(1).trim().split(/\s+/).filter(Boolean);
    const [cmd, ...args] = parts;
    if (!cmd) {
      text.value = "";
      return;
    }
    emit("command", cmd.toLowerCase(), args);
  } else if (v.length > 0) {
    emit("message", v);
  } else {
    emit("testnotify");
  }

  text.value = "";
  sendTyping(false);
}
const dense = ref(true);

onBeforeUnmount(() => {
  sendTyping(false);
});
</script>

<style scoped>
.input-bar {
  height: 100%;
  margin: 0 auto;
  width: 98%;
  display: flex;
  align-items: center;
}
</style>
