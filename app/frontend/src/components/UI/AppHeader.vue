<template>
<q-header elevated>
      <q-toolbar>
        <q-toolbar-title> {{ title }} </q-toolbar-title>
        <q-btn flat   @click="$emit('toggle-drawer')" round dense icon="menu" class="lt-md"/>
      </q-toolbar>
</q-header>
</template>

<script setup lang="ts">



interface Header {
  title:string
 }

defineProps<Header>();
defineEmits<{ 'toggle-drawer': [] }>()
</script>

