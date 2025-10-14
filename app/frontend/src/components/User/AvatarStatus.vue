<template>
  <q-avatar size="40px">
    <q-icon name="account_circle" size="md" />
    <template v-if="status">
      <StatusBadge :status="status" />
    </template>
    <slot name="menu"/>
  </q-avatar>
</template>

<script setup lang="ts">
import StatusBadge from "./StatusBadge.vue";

interface Props {
  status?: "online" | "offline" | "dnd";
}

defineProps<Props>();
</script>
