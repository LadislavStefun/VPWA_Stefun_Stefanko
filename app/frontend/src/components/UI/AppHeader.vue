<template>
<q-header elevated>
      <q-toolbar>
        <q-toolbar-title> {{ title }} </q-toolbar-title>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" class="lt-md"/>
      </q-toolbar>
</q-header>
</template>

<script setup lang="ts">
import { ref } from "vue";
const drawer = ref(false);

interface Header {
  title:string
 }

defineProps<Header>();
</script>

