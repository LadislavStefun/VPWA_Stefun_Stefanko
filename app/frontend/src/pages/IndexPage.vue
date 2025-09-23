<template>
  <q-page
    padding
    class="home-page window-height window-width column justify-center items-center"
  >
    <div class="text-h6">SPA starter</div>
    <div class="q-mt-md">API health: {{ health }}</div>
    <q-btn class="q-mt-md" label="Ping API" @click="check" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { api } from "boot/axios";

const health = ref("unknown");
async function check() {
  const { data } = await api.get("/health");
  health.value = data.status;
}
</script>
