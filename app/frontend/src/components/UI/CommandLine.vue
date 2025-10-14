<template>
<div class="input-bar">
    <q-input
      filled
      v-model="text"
      :dense="dense"
      class="w-full"
      placeholder="Say something..."
      style="width: 100%; height: auto;"
    />
    <q-btn color="primary"  unelevated class="send-btn " icon="send" label="Send"/>
  </div>



</template>
<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')
const dense = ref(true)
</script>

