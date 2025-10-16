<template>
  <q-dialog v-model="modalwin">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section> <div class="text-h6">List of users</div></q-card-section>
      <q-card-section class="q-pt-none">
        <UserInList name="Martin" avatar="MS" status="online" email="martin@stefanko" />
        <UserInList name="Laco" avatar="LS" status="offline" email="laco@stefun" />
        <UserInList name="Rytmus" avatar="RM" status="dnd" email="rytmus@kral" />
      </q-card-section>
      <q-card-actions class="bg-white text-teal">
        <q-btn flat label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import UserInList from "./UserInList.vue";

const modalwin = defineModel<boolean>({ default: false });
</script>
