<template>
  <q-drawer v-model="model" show-if-above bordered>
    <SearchBar />
    <q-list bordered>
      <q-scroll-area style="height: 80vh">
        <DrawerItem name="Test1" iconName="contacts" is-new />
        <DrawerItem name="Ahoj" iconName="contacts" />
        <DrawerItem name="Ahoj" iconName="contacts" />
      </q-scroll-area>
    </q-list>
    <UserCard name="Kokot" status="online" />
  </q-drawer>
</template>

<script setup lang="ts">
import UserCard from "../User/UserCard.vue";
import DrawerItem from "src/components/UI/DrawerItem.vue";
import SearchBar from "./SearchBar.vue";
const model = defineModel<boolean>({ default: false });
</script>
