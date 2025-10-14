<template>
  <q-card flat bordered class="full-width">
    <q-card-section class="flex col justify-between items-center">
      <div>
        <AvatarStatus status="busy" />
        <span class="q-ml-md">{{ name }}</span>
      </div>
      <q-btn @click="handleLogout" flat round color="primary" icon="logout" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import AvatarStatus from "./AvatarStatus.vue";

import { useRouter } from "vue-router";
const router = useRouter();

interface UserCardProps {
  name: string;
}

defineProps<UserCardProps>();

const handleLogout = async () => {
  await router.push("/auth/login");
};
</script>
