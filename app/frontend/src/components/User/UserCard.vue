<template>
  <q-card flat bordered class="full-width">
    <q-card-section class="flex col justify-between items-center">
      <q-btn @click="handleLogout" flat round color="primary" icon="logout" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const handleLogout = async () => {
  await router.push("/auth/login");
};
</script>
