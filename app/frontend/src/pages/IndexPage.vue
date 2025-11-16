<template>
  <q-page class="chat-grid">
    <ChatContainer />
    <CommandLine @command="onCommand"  @message="onMessage" @testnotify="onNotify" ></CommandLine>
    <UsersList v-model="showUsersModal" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ChatContainer from "src/components/Chat/ChatContainer.vue";
import CommandLine from "src/components/Chat/CommandLine.vue";
import UsersList from "src/components/UI/UsersList.vue";
import { useQuasar } from "quasar";
import { useChannelsStore } from "src/store/channelStore";
import type { ChannelType } from "src/types";

const quasar = useQuasar();

const showUsersModal = ref(false);
const channelsStore = useChannelsStore();

const onCommand = async (cmd: string, args: string[]) => {
  const command = cmd.toLowerCase();

  if (command === "list") {
    showUsersModal.value = true;
    return;
  }


  if (command === "join") {
    const name = args[0];
    const privacyArg = args[1];

    if (!name) {
      quasar.notify({
        type: "warning",
        message: "Použitie: /join channelName [private]",
      });
      return;
    }

    const type: ChannelType = privacyArg === "private" ? "private" : "public";
    const existing = channelsStore.channels.find((ch) => ch.name === name);

    if (existing) {
    channelsStore.setActiveChannel(existing.id);
    quasar.notify({
      type: "info",
      message: `Už si členom kanála #${name}`,
    });
    return;
    }

    try {
      await channelsStore.joinOrCreateChannelByName(name, type);
      quasar.notify({
        type: "positive",
        message: `Joined channel ${name}`,
      });
    } catch (e) {
      console.error(e);
      quasar.notify({
        type: "negative",
        message:
          e instanceof Error
            ? e.message
            : "Failed to join/create channel",
      });
    }

    return;
  }

  quasar.notify({
    type: "info",
    message: `Unknown command: /${command}`,
  });
};

const onMessage = (message: string) => {

  console.log("message from input:", message);
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
  grid-template-rows: 1fr auto;
  grid-template-columns: auto;
  padding-bottom: 16px;
}
</style>
