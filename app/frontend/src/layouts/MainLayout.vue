<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Mark@ </q-toolbar-title>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" class="lt-md"/>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered>
      <div class="q-pa-sm" style="max-width: 700px; margin: 0 auto">
        <q-input v-model="search" dense outlined clearable placeholder="Search...">
          <q-btn flat dense round icon="arrow_forward" />
        </q-input>
      </div>
      <q-list bordered>
        <q-scroll-area style="height:80vh;"  >
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="contacts" />
          </q-item-section>

          <q-item-section>TEST</q-item-section>
          <q-item-section side>
          <q-badge text-color="white" label="New" />
          </q-item-section>
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
      </q-scroll-area>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
const search = ref("");
const drawer = ref(false);
</script>
