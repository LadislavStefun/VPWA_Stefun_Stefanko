<template>
  <q-chat-message
    v-if="typing"
    :name="name"
    :sent="sent"
    bg-color="grey-4"
    text-color="dark"
    q-ml-md
  >
    <div class="row items-center no-wrap">
      <div>Typing</div>
      <q-spinner-dots size="20px" class="q-ml-xs" />
    </div>
  </q-chat-message>

  <div
    v-else
    :class="{
      'flex row items-center': !sent,
    }"
  >
    <q-chat-message
      :name="name"
      :sent="sent"
      :text="messageText"
      :text-html="true"
      :bg-color="sent ? 'grey-4' : 'primary'"
      :text-color="!sent ? 'white' : 'black'"
    >
    </q-chat-message>
    <q-icon
      v-if="tagged && !sent"
      name="alternate_email"
      class="q-ml-xs"
      size="16px"
      :color="!sent ? 'primary' : 'grey-6'"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
interface ChatMessage {
  id?: string | number;
  name: string;
  sent?: boolean;
  typing?: boolean;
  text?: string[];
  tagged?: boolean;
}

const props = defineProps<ChatMessage>();

const formatMessage = (text: string) => {
  return text.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
};

const messageText = computed(() => {
  if (!props.text || props.text.length === 0) return [];
  return props.text.map(formatMessage);
});
</script>

<style scoped>
:deep(.mention) {
  color: #ebae09;
  font-weight: bold;
  background: rgba(25, 118, 210, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
