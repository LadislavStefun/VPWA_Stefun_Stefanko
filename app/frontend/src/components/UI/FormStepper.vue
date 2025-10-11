<template>
  <q-stepper
    :model-value="currentStep"
    alternative-labels
    class="transparent"
    flat
    animated
    contracted
  >
    <q-step
      v-for="step in steps"
      :key="step.name"
      :name="step.name"
      :title="step.title"
      :icon="step.icon"
      done-icon="none"
      :done="currentStep > step.name"
    />
  </q-stepper>
</template>

<script setup lang="ts">
interface Step {
  name: number;
  title: string;
  icon: string;
}

defineProps<{
  currentStep: number;
  steps: Step[];
}>();
</script>

<style scoped>
/* Remove annoying padding */
:deep(.q-panel-scroll) {
  display: none !important;
}

:deep(.q-stepper__content) {
  display: none !important;
}

:deep(.q-stepper) {
  background: transparent !important;
}

:deep(.q-stepper__header) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
