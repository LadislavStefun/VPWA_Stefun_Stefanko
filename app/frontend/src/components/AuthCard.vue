<template>
  <q-card class="q-pa-lg auth-card">
    <q-card-section class="text-center">
      <AppLogo />
      <div class="title q-mt-md">
        {{ title }}
      </div>
    </q-card-section>
    <q-form @submit.prevent="$emit('submit')">
      <q-card-section>
        <slot name="fields" />
      </q-card-section>
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
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap");

.title {
  font-family: "Montserrat", sans-serif;
  color: var(--q-primary);
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
}

</style>
