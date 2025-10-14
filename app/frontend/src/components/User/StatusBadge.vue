<template>
  <q-badge :color="badgeColor" rounded floating />
</template>

<script setup lang="ts">
import { computed } from "vue";
interface Status {
  status: "online" | "offline" | "busy";
}

const props = defineProps<Status>();

const badgeColor = computed(() => {
  switch (props.status) {
    case "online":
      return "green";
    case "offline":
      return "grey";
    case "busy":
      return "red";
    default:
      return "grey";
  }
});
</script>
