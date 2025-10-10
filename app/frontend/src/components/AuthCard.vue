<template>
  <q-card class="auth-card">
    <q-card-section class="text-center">
      <AppLogo />
      <div class="title q-mt-md">
        {{ title }}
      </div>
    </q-card-section>
    <q-form @submit.prevent="$emit('submit')">
      <q-card-section> <slot name="fields" /> </q-card-section>
      <q-card-section class="flex flex-center"> <slot name="buttons" /> </q-card-section>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import AppLogo from "./AppLogo.vue";

defineProps<{
  title: string;
}>();

defineEmits<{
  submit: [];
}>();
</script>

<style scoped>
.title {
  font-family: "Montserrat", sans-serif;
  color: var(--q-primary);
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
}

.auth-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
}
</style>
