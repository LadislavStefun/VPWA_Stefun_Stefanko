  <template>
  <q-dialog v-model="isSettingsOpen">
    <q-card class="users-dialog q-pa-md">
      <q-card-section>
        <div class="text-h6">Settings</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-checkbox
          v-model="notifyMentionsOnlyModel"
          color="secondary"
          label="Notifications only when mentioned."
        />
      </q-card-section>
      <q-card-actions class="bg-white text-teal">
        <q-btn flat label="OK" @click="onOk" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

  <script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { usePreferencesStore } from 'src/store/preferencesStore'

  const isSettingsOpen = defineModel<boolean>({ default: false })

  const preferencesStore = usePreferencesStore()
  const notifyMentionsOnlyModel = ref(false)

  onMounted(async () => {
  if (!preferencesStore.loaded) {
    try {
      await preferencesStore.loadPreferences()
    } catch (e) {
      console.error('Failed to load preferences', e)
    }
  }
  })

  watch(
    () => isSettingsOpen.value,
    (open) => {
    if (open) {
      notifyMentionsOnlyModel.value = preferencesStore.notifyMentionsOnly
    }
  }
  )

  const onOk = async () => {
    preferencesStore.notifyMentionsOnly = notifyMentionsOnlyModel.value
    try {
    await preferencesStore.savePreferences()
    } catch (e) {
    console.error('Failed to save preferences', e)
    }
  }
  </script>

  <style scoped>
  .users-dialog {
    width: 700px;
    max-width: 80vw;
  }
  </style>
