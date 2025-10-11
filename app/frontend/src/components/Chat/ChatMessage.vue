<template>
  <q-chat-message
    v-if="typing"
    :name="name"
    :sent="sent"
    bg-color="grey-4"
    text-color="dark"
  >
    <div class="row items-center no-wrap">
      <div>Typing</div>
      <q-spinner-dots size="20px" class="q-ml-xs" />
    </div>
  </q-chat-message>

  <q-chat-message
    v-else
    :name="name"
    :sent="sent"
    :text="text"

    :bg-color="sent ? 'grey-4' : 'primary'"
    :text-color="!sent ? 'white' : 'black'"

  />
</template>



<script setup lang="ts">
 interface ChatMessage {
  id?: string | number
  name: string
  sent?: boolean
  typing?: boolean
  text?: string[]
 }

defineProps<ChatMessage>();
</script>


