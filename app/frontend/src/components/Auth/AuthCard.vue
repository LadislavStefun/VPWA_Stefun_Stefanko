<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg auth-card">
      <q-card-section class="text-center">
        <AppLogo />
        <div class="title q-mt-md">
          {{ title }}
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none" v-if="$slots.stepper">
        <slot name="stepper" />
      </q-card-section>
      <!-- Default form behavior used for login -->
      <q-form v-if="isForm" @submit.prevent="$emit('submit')">
        <q-card-section>
          <slot name="fields" />
        </q-card-section>
        <q-card-section class="flex flex-center">
          <slot name="buttons" />
        </q-card-section>
      </q-form>
      <!-- In need of custom form handling used in multistep register -->
      <template v-else>
        <q-card-section>
          <slot name="fields" />
        </q-card-section>
        <q-card-section  v-if="$slots.navigation">
          <slot name="navigation"></slot>
        </q-card-section>
        <q-card-section class="flex flex-center">
          <slot name="buttons" />
        </q-card-section>
      </template>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import AppLogo from "../AppLogo.vue";

interface Props {
  title: string;
  isForm?: boolean;
}

withDefaults(defineProps<Props>(), {
  isForm: true,
});

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
