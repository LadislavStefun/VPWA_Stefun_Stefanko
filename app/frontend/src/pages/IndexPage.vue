<template>
  <ChatContainer> </ChatContainer>
  <CommandLine @command="onCommand"></CommandLine>
  <UsersList v-model="showUsersModal" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import ChatContainer from "src/components/Chat/ChatContainer.vue";
import CommandLine from "src/components/UI/CommandLine.vue";
import UsersList from "src/components/UI/UsersList.vue";

const showUsersModal = ref(false);

function onCommand(cmd: string) {
  if (cmd === "list") {
    showUsersModal.value = true;
  }
}
</script>
