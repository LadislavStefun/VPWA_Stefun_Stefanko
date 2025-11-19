<template>
  <q-layout view="hHh lpR fFf">
    <AppHeader title="Mark@" @toggle-drawer="drawer = !drawer" />
    <AppDrawer v-model="drawer" />


    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AppDrawer from "src/components/UI/AppDrawer.vue";
import AppHeader from "src/components/UI/AppHeader.vue";
import { useChannelsStore } from 'src/store/channelStore'
import { useAuthStore } from 'src/store/authStore'
const drawer = ref(false)

const channelsStore = useChannelsStore()
const authStore = useAuthStore()

watch(
  () => authStore.isAuthenticated,
  (isAuthed) => {
    if (isAuthed) {
      channelsStore.loadChannels().catch((e) => {
        console.error('Failed to load channels', e)
      })
    } else {
      channelsStore.reset()
    }
  },
  { immediate: true }
)

</script>
