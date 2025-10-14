<template>
  <q-drawer v-model="drawer" show-if-above bordered>
    <SearchBar />
    <q-list bordered>
      <q-scroll-area style="height: 80vh">
        <DrawerItem name="Test1" iconName="contacts" is-new />
        <DrawerItem name="Ahoj" iconName="contacts" />
        <DrawerItem name="Ahoj" iconName="contacts" />
      </q-scroll-area>
    </q-list>
    <UserCard name="Milan" status="offline" />
  </q-drawer>
</template>

<script setup lang="ts">
import DrawerItem from "src/components/UI/DrawerItem.vue";
import UserCard from "src/components/User/UserCard.vue";
import { ref } from "vue";
import SearchBar from "./SearchBar.vue";
const drawer = ref(false);
</script>
