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
import { ref, onMounted } from 'vue'
import AppDrawer from "src/components/UI/AppDrawer.vue";
import AppHeader from "src/components/UI/AppHeader.vue";
import { useChannelsStore } from 'src/store/channelStore'
const drawer = ref(false)

const channelsStore = useChannelsStore()

onMounted(() => {
  channelsStore.loadChannels().catch((e) => {
    console.error('Failed to load channels', e)
  })
})

</script>
