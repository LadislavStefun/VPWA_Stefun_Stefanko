<template>
  <label class="input-label">{{ label }}</label>
  <q-input
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event?.toString() || '')"
    dense
    outlined
    class="custom-input"
    :type="computedInputType"
    :placeholder="placeholder"
    :hint="hint"
    :autofocus="autofocus"
    lazy-rules
    :rules="rules"
    @keyup.enter="$emit('enter')"
  >
    <!-- // https://quasar.dev/vue-components/input/ -->
    <template v-if="inputType === 'password'" v-slot:append>
      <q-icon
        v-if="modelValue && modelValue.length > 0"
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        role="button"
        :aria-label="isPwd ? 'Show password' : 'Hide password'"
        tabindex="0"
        @click="isPwd = !isPwd"
        @keyup.enter="isPwd = !isPwd"
        @keyup.space.prevent="isPwd = !isPwd"
      />
    </template>
  </q-input>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";

const props = defineProps<{
  label?: string;
  modelValue: string;
  inputType?: "text" | "password" | "email" | "search";
  placeholder?: string;
  hint?: string;
  autofocus?: boolean;
  rules?: Array<(val: string) => boolean | string>;
}>();

defineEmits<{
  "update:modelValue": [value: string];
  enter: [];
}>();

const isPwd = ref(true);

const computedInputType = computed(() => {
  if (props.inputType === "password") {
    return isPwd.value ? "password" : "text";
  }
  return props.inputType || "text";
});
</script>

<style scoped>
.input-label {
  display: block;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  color: var(--q-primary);
  margin-bottom: 6px;
  font-size: 0.9rem;
  text-align: left;
}

.custom-input {
  font-family: "Montserrat", sans-serif;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
