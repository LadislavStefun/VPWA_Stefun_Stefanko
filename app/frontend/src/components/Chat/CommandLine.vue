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
import { ref } from "vue";

const text = ref("");

const emit = defineEmits<{
  (e: "command", cmd: string, args: string[]): void;
  (e: "message", message: string): void;
  (e: "testnotify"): void;
}>();

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
}
const dense = ref(true);
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
