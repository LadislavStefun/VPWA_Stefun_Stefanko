<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER -->
    <q-header elevated>

      <q-toolbar>

  
        <q-toolbar-title>
          Moja Aplikácia
        </q-toolbar-title>

         <q-btn flat round icon="account_circle" />
      </q-toolbar>
    </q-header>


    <q-drawer  show-if-above bordered>
      <div class="q-pa-sm" style="max-width: 700px; margin: 0 auto;">

    <q-input v-model="search" dense outlined clearable placeholder="Hľadať…">
      <q-btn flat dense round icon="arrow_forward" />
    </q-input>

    </div>
      <q-list bordered>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="primary" name="contacts" />
        </q-item-section>

        <q-item-section>TEST</q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="primary" name="contacts" />
        </q-item-section>

        <q-item-section>TEST</q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="primary" name="contacts" />
        </q-item-section>

        <q-item-section>TEST</q-item-section>
      </q-item>

    </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const search = ref('')
</script>
