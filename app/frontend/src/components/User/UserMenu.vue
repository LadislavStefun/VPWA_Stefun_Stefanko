<template>
  <q-menu auto-close> 
    <div
      v-for="option in statusOptions"
      :key="option.value"
      class="col items-center justify-between q-py-sm q-px-md cursor-pointer rounded-borders"
      @click="selectStatus(option.value)"
    >
      <StatusBadge :is-floating="false" :status="option.value" />
      <span class="q-ml-md">{{ option.label }}</span>
    </div>
  </q-menu>
</template>

<script setup lang="ts">
import StatusBadge from "./StatusBadge.vue";

type UserStatus = "online" | "offline" | "dnd";

interface Props {
  selectedStatus?: UserStatus;
}
withDefaults(defineProps<Props>(), {
  selectedStatus: "online",
});

const statusOptions = [
  { value: "online" as const, label: "Online" },
  { value: "dnd" as const, label: "Do not disturb" },
  { value: "offline" as const, label: "Offline" },
];

const emit = defineEmits<{
  "update:selectedStatus": [status: UserStatus];
}>();

const selectStatus = (status: UserStatus) => {
  emit("update:selectedStatus", status);
};
</script>
