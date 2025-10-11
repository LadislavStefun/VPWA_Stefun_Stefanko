<template>
    <div class="row justify-between q-gutter-sm">
      <q-btn
        v-if="showPrevious"
        flat
        color="primary"
        @click="$emit('previous')"
        class="col"
      >
        Previous
      </q-btn>

      <q-btn
        v-if="showNext"
        color="primary"
        @click="$emit('next')"
        class="col"
        :disable="!canProceed"
      >
        Next
      </q-btn>

      <q-btn
        v-if="showSubmit"
        color="primary"
        class="col"
        @click="$emit('submit')"
      >
        {{ submitText }}
      </q-btn>
    </div>

</template>

<script setup lang="ts">
defineProps<{
  showPrevious?: boolean;
  showNext?: boolean;
  showSubmit?: boolean;
  canProceed?: boolean;
  submitText?: string;
}>();

defineEmits<{
  previous: [];
  next: [];
  submit: [];
}>();
</script>