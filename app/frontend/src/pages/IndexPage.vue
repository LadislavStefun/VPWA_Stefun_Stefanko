<template>
  <q-page class="chat-grid">
    <ChatContainer/>
    <CommandLine @command="onCommand" @testnotify="onNotify"></CommandLine>
    <UsersList v-model="showUsersModal" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ChatContainer from "src/components/Chat/ChatContainer.vue";
import CommandLine from "src/components/Chat/CommandLine.vue";
import UsersList from "src/components/UI/UsersList.vue";
import { useQuasar } from "quasar";

const quasar = useQuasar();

const showUsersModal = ref(false);

const onCommand = (cmd: string) => {
  if (cmd === "list") {
    showUsersModal.value = true;
  }
};

//https://quasar.dev/quasar-plugins/notify/
const onNotify = () => {
  quasar.notify({
    message: "You've been pinged.",
    icon: "announcement",
    position: "top",
  });
};
</script>

<style scoped>
.chat-grid {
  height: 100%;
  display: grid;
  grid-template-rows: 9fr 1fr;
}

@media (min-width: 1920px) and (min-height: 1080px) {
  .chat-grid {  grid-template-rows: 19fr 1fr; }
}
</style>
