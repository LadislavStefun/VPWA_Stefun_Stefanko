<template>
  <q-dialog v-model="isCreateNewChannelOpen">
    <q-card class="users-dialog q-pa-md">
      <q-card-section><div class="text-h6">Create new channel</div></q-card-section>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md" @keydown.enter.prevent.stop>
        <q-input filled v-model.trim="name" label="Channel name *"/>
        <q-option-group v-model="visibility" :options="visibilityOptions" type="radio" color="secondary" inline/>
        <div>
          <q-btn label="Submit" type="submit" color="primary" :disable="!name" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, } from 'vue'
import type { QInput } from 'quasar'

const isCreateNewChannelOpen = defineModel<boolean>({ default: false })

const name = ref('')


type Visibility = 'public' | 'private'
const visibility = ref<Visibility>('public')
const visibilityOptions: { label: string; value: Visibility }[] = [
  { label: 'Public Channel', value: 'public' },
  { label: 'Private Channel', value: 'private' }
]

const onSubmit = () => {
  const n = name.value.trim()
  if (!n) return


  name.value = ''
  visibility.value = 'public'

}
</script>


<style scoped>
.users-dialog { width: 700px; max-width: 80vw; }
</style>
