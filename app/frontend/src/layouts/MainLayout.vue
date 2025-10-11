<template>
  <q-layout view="hHh lpR fFf">
    <AppHeader title="Mark@" />
    <AppDrawer />
    
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AppDrawer from "src/components/UI/AppDrawer.vue";
import AppHeader from "src/components/UI/AppHeader.vue";

</script>
