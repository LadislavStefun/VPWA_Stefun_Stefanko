<template>
  <div class="q-pa-md row justify-center">
    <div style="width: 100%; max-width: 50%; z-index: -1">
      <q-chat-message name="me" :text="['hey, how are you?']" sent />
      <q-chat-message
        name="Jane"
        bg-color="primary"
        text-color="white"
        :text="['doing fine, how r you?']"
      />
      <q-chat-message name="me" :text="['hey, how are you?']" sent />
      <q-chat-message
        name="Jane"
        bg-color="primary"
        text-color="white"
        :text="['doing fine, how r you?']"
      />
      <q-chat-message name="me" :text="['hey, how are you?']" sent />
      <q-chat-message
        name="Jane"
        bg-color="primary"
        text-color="white"
        :text="['doing fine, how r you?']"
      />
    </div>
  </div>
  <div></div>

  <q-page-sticky
    position="bottom"
    expand
    :offset="[0, 0]"
    style="width: 50%; margin: 0 auto"
  >
    <div class="q-pa-sm full-width" style="max-width: 90%; background-color: grey">
      <q-input
        v-model="text"
        filled
        dense
        placeholder="Napíš správu alebo príkaz (/join …)"
        class="full-width"
        style="background-color: lightgray"
        @keyup.enter.exact="send"
      >
        <template #append>
          <q-btn flat round icon="send" @click="send" :disable="!text.trim()" />
        </template>
      </q-input>
    </div>
  </q-page-sticky>
</template>
<script setup lang="ts">
import { ref } from "vue";
const text = ref("");
function send() {
  if (!text.value.trim()) return;
  // TODO: dispatch do store/command parser
  console.log("SEND:", text.value);
  text.value = "";
}
</script>
