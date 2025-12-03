<template>
  <q-chat-message
    v-if="typing"
    :sent="sent"
    bg-color="grey-4"
    text-color="dark"
    q-ml-md
    class="typing-bubble"
    @click="handleNicknameClick"
  >
    <template #name>
      <span class="clickable-nickname" @click="handleNicknameClick">
        {{ name }}
      </span>
    </template>
    <div class="row items-center no-wrap" v-if="!showTypingPreview">
      <div>Typing</div>
      <q-spinner-dots size="20px" class="q-ml-xs" />
    </div>
    <div class="row items-center no-wrap" v-else>
      <span>{{ livePreview }}</span>
      <span class="typing-cursor">|</span>
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
import { computed, ref } from "vue";
interface ChatMessage {
  id?: string | number;
  name: string;
  sent?: boolean;
  typing?: boolean;
  text?: string[];
  tagged?: boolean;
}

const props = defineProps<ChatMessage>();
const showTypingPreview = ref(false);

const formatMessage = (text: string) => {
  return text.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
};

const messageText = computed(() => {
  if (!props.text || props.text.length === 0) return [];
  return props.text.map(formatMessage);
});

const handleNicknameClick = () => {
  showTypingPreview.value = !showTypingPreview.value;
};

const livePreview = computed(() => {
  if (!props.text || props.text.length === 0) return '';
  return props.text[0];
});
</script>

<style scoped>
:deep(.mention) {
  color: #ffbb00;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.253);
  padding: 2px 4px;
  border-radius: 4px;
}
.clickable-nickname {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  padding: 2px 4px;
}
.typing-bubble {
  cursor: pointer;
}
.clickable-nickname:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.typing-cursor {
  color: #1976d2;
  font-weight: bold;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
