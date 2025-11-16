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

  if (command === 'invite') {
    const nickName = args[0]
    if (!nickName) {
      quasar.notify({
        type: 'warning',
        message: 'Použitie: /invite nickName',
      })
      return
    }

    try {
      await channelsStore.inviteUserToActiveChannel(nickName)
      quasar.notify({
        type: 'positive',
        message: `User ${nickName} invited to channel`,
      })
    } catch (e) {
      console.error(e)
      quasar.notify({
        type: 'negative',
        message:
          e instanceof Error ? e.message : 'Failed to invite user to channel',
      })
    }

    return
  }

  if (command === 'revoke') {
    const nickName = args[0]
    if (!nickName) {
      quasar.notify({
        type: 'warning',
        message: 'Použitie: /revoke nickName',
      })
      return
    }

    try {
      await channelsStore.revokeUserFromActiveChannel(nickName)
      quasar.notify({
        type: 'positive',
        message: `User ${nickName} revoked from channel`,
      })
    } catch (e) {
      console.error(e)
      quasar.notify({
        type: 'negative',
        message:
          e instanceof Error ? e.message : 'Failed to revoke user from channel',
      })
    }

    return
  }
  if (command === 'kick') {
  const nickName = args[0]
  if (!nickName) {
    quasar.notify({
      type: 'warning',
      message: 'Usage: /kick nickName',
    })
    return
  }

  try {
    const result = await channelsStore.kickUserFromActiveChannel(nickName)
    const msg = result.message || `Kick command executed for ${nickName}`

    quasar.notify({
      type: 'info',
      message: msg,
    })
  } catch (e) {
    console.error(e)
    quasar.notify({
      type: 'negative',
      message:
        e instanceof Error ? e.message : 'Failed to kick user from channel',
    })
  }

  return
}

if (command === 'quit') {
    const current = channelsStore.activeChannel

    if (!current) {
      quasar.notify({
        type: 'warning',
        message: 'No active channel to quit',
      })
      return
    }

    try {
      await channelsStore.quitActiveChannel()
      quasar.notify({
        type: 'positive',
        message: `Channel #${current.name} has been closed`,
      })
    } catch (e) {
      console.error(e)
      quasar.notify({
        type: 'negative',
        message:
          e instanceof Error
            ? e.message
            : 'Failed to close the channel',
      })
    }

    return
  }
  if (command === 'cancel') {
  const current = channelsStore.activeChannel
  if (!current) {
    quasar.notify({
      type: 'warning',
      message: 'No active channel to cancel',
    })
    return
  }

  try {
    await channelsStore.cancelMembershipInActiveChannel()
    quasar.notify({
      type: 'positive',
      message: `You left channel #${current.name}`,
    })
  } catch (e) {
    console.error(e)
    quasar.notify({
      type: 'negative',
      message:
        e instanceof Error
          ? e.message
          : 'Failed to cancel channel membership',
    })
  }

  return
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
