  <template>
    <q-dialog v-model="isSettingsOpen">
      <q-card class="users-dialog q-pa-md">
        <q-card-section> <div class="text-h6">Settings</div></q-card-section>
        <q-card-section class="q-pt-none">
          <q-checkbox
        v-model="customModel"
        color="secondary"
        label="Notifications only when mentioned."
        true-value="yes"
        false-value="no"
      />
        </q-card-section>
        <q-card-actions class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>

  <script setup lang="ts">
  import { ref } from 'vue'
  const customModel = ref('no');

  const isSettingsOpen = defineModel<boolean>({ default: false });
  </script>

  <style scoped>
  .users-dialog {
    width: 700px;
    max-width: 80vw;
  }
  </style>
