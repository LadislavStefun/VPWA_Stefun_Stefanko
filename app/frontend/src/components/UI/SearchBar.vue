<template>
  <div class="q-pa-sm" style="max-width: 700px; margin: 0 auto">
        <q-input v-model="search" dense outlined clearable placeholder="Search...">
          <q-btn flat dense round icon="arrow_forward" />
        </q-input>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const search = ref("");
</script>
