<template>
  <q-badge :color="badgeColor" rounded :floating="isFloating" />
</template>

<script setup lang="ts">
import { computed } from "vue";
interface Status {
  status: "online" | "offline" | "dnd";
  isFloating?: boolean;
}

const props = withDefaults(defineProps<Status>(), { isFloating: true });

const badgeColor = computed(() => {
  switch (props.status) {
    case "online":
      return "green";
    case "offline":
      return "grey";
    case "dnd":
      return "red";
    default:
      return "grey";
  }
});
</script>
