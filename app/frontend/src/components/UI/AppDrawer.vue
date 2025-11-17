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
            @click="channelsStore.setActiveChannel(channel.id)"
            @delete="channelsStore.deleteChannel(channel.id)"
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

const channelsStore = useChannelsStore();
const sortedChannels = computed(() => {
  return [...channelsStore.channels].sort((a: Channel, b: Channel) => {
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    return a.name.localeCompare(b.name);
  });
});
const model = defineModel<boolean>({ default: false });
</script>
