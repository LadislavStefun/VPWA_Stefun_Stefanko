<template>
  <q-drawer v-model="model" show-if-above bordered>
    <div class="column fit no-wrap">
      <SearchBar style="width: 100%" />
      <q-scroll-area class="col">
        <q-list bordered>
          <DrawerItem
            v-for="channel in channelsStore.channels"
            :key="channel.id"
            :name="channel.name"
            :is-new="channel.isNew"
            :is-private="channel.isPrivate"
            @click="channelsStore.setActiveChannel(channel.id)"
          />
        </q-list>
      </q-scroll-area>
      <UserCard name="Milan" status="online" />
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import UserCard from "../User/UserCard.vue";
import DrawerItem from "src/components/UI/DrawerItem.vue";
import SearchBar from "./SearchBar.vue";
import { useChannelsStore } from "src/store/channelStore";

const channelsStore = useChannelsStore();
const model = defineModel<boolean>({ default: false });
</script>
