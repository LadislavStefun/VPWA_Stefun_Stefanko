<template>
  <q-drawer v-model="model" show-if-above bordered>
    <div class="column fit no-wrap">
      <SearchBar style="width: 100%" />
      <q-scroll-area class="col">
        <q-list bordered>
          <DrawerItem
            v-for="channel in sortedChannels"
            :key="channel.id"
            :name="channel.name"
            :is-new="channel.isNew"
            :type="channel.type"
            :is-active="channel.id === channelsStore.activeChannelId"
            :is-invited="channel.isInvited"
            :is-owner="channel.ownerId === currentUserId"
            @click="channelsStore.setActiveChannel(channel.id)"
            @delete="onDeleteChannel(channel)"
            @leave="onLeaveChannel(channel)"
            @accept-invite="onAcceptInvite(channel)"
            @decline-invite="onDeclineInvite(channel)"
          />
        </q-list>
      </q-scroll-area>
      <UserCard name="Milan" status="online" />
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UserCard from "../User/UserCard.vue";
import DrawerItem from "src/components/UI/DrawerItem.vue";
import SearchBar from "./SearchBar.vue";
import { useChannelsStore } from "src/store/channelStore";
import type { Channel } from "src/types";
import { useAuthStore } from "src/store/authStore";

const channelsStore = useChannelsStore();
const sortedChannels = computed(() => {
  return [...channelsStore.channels].sort((a: Channel, b: Channel) => {
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    return a.name.localeCompare(b.name);
  });
});
const model = defineModel<boolean>({ default: false });

const authStore = useAuthStore()

const currentUserId = computed<string | null>(() =>
  authStore.user ? String(authStore.user.id) : null
)

const onAcceptInvite = async (channel: Channel) => {
  try {
    await channelsStore.joinOrCreateChannelByName(channel.name)
    channel.isNew = false
    channel.isInvited = false
  } catch (e) {
    console.error(e)
  }
}

const onDeclineInvite = async (channel: Channel) => {
  try {
    await channelsStore.declineInvite(channel.id)
    channelsStore.channels = channelsStore.channels.filter(
      (ch) => ch.id !== channel.id
    )
  } catch (e) {
    console.error(e)
  }
}

const onDeleteChannel = async (channel: Channel) => {
  try {
    await channelsStore.quitChannel(channel.id);
  } catch (e) {
    console.error(e);
  }
};

const onLeaveChannel = async (channel: Channel) => {
  try {
    await channelsStore.leaveChannel(channel.id);
  } catch (e) {
    console.error(e);
  }
};
</script>
