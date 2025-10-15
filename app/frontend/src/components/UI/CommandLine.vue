<template>
  <div class="input-bar">
    <q-input
      filled
      v-model="text"
      :dense="dense"
      class="input"
      placeholder="Say something..."
      style="width: 100%;"
      @keyup.enter="submit"
    />
    <q-btn color="primary" round class="q-ml-md input" unelevated icon="send" @click="submit" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const text = ref('')

const emit = defineEmits<{
  (e:'command', cmd: string, args: string[]): void
  (e:'message', message: string): void
}>()


function submit () {
  const v = text.value.trim()
  if (!v) return

  if (v.startsWith('/')) {
    const parts = v.slice(1).trim().split(/\s+/).filter(Boolean)
    const [cmd, ...args] = parts
    if (!cmd) { text.value = ''; return }
    emit('command', cmd.toLowerCase(), args)
  } else {
    emit('message', v)
  }
  text.value = ''
}
const dense = ref(true);

</script>

<style scoped>
.input-bar {
  height: 5vh;
  margin: 0 auto;
  width: 98%;
  display: flex;
  align-items: center;
}
.input{
  margin-bottom:0px;
}


@media (max-width: 1439px) {
  .input { margin-bottom: 10px; }
}


</style>

