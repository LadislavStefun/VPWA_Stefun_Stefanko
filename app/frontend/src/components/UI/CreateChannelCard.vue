<template>
  <q-dialog v-model="isCreateNewChannelOpen">
    <q-card class="users-dialog q-pa-md">
      <q-card-section><div class="text-h6">Create new channel</div></q-card-section>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md" @keydown.enter.prevent.stop>
        <q-input
          filled
          v-model.trim="name"
          label="Channel name *"
          :rules="[validationRules.maxLength(12, 'Channel name')]"
        />
        <q-option-group
          v-model="visibility"
          :options="visibilityOptions"
          type="radio"
          color="secondary"
          inline
        />
        <div>
          <q-btn label="Submit" type="submit" color="primary" :disable="!name" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useChannelsStore } from "src/store/channelStore";
import type { ChannelType } from "src/types";
import type { QInput } from "quasar";
import { validationRules } from "src/utils";

const isCreateNewChannelOpen = defineModel<boolean>({ default: false });

const name = ref("");
const visibility = ref<ChannelType>("public");

const channelStore = useChannelsStore();
const loading = ref(false);
const error = ref('');

const visibilityOptions: { label: string; value: ChannelType }[] = [
  { label: "Public Channel", value: "public" },
  { label: "Private Channel", value: "private" },
];

const onSubmit = async () => {
  error.value = ''
  const n = name.value.trim()
  if (!n) return

  loading.value = true
  try {
    await channelStore.addChannel(n, visibility.value)
    name.value = ''
    visibility.value = 'public'
    isCreateNewChannelOpen.value = false
  } catch (e: unknown) {
  if (e instanceof Error) {
    error.value = e.message || 'Nepodarilo sa vytvoriť kanál'
  } else {
    error.value = 'Nepodarilo sa vytvoriť kanál'
  }
  }finally {
    loading.value = false
  }
}
</script>

<style scoped>
.users-dialog {
  width: 700px;
  max-width: 80vw;
}
</style>
