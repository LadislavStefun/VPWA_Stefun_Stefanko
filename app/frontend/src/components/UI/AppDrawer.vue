<template>
  <q-drawer v-model="model" show-if-above bordered>
    <div class="column fit no-wrap">
      <SearchBar />
      <q-scroll-area class="col">
        <q-list bordered>
          <DrawerItem name="Test1" iconName="contacts" is-new />
          <DrawerItem name="Ahoj" iconName="contacts" />
          <DrawerItem name="Ahoj" iconName="contacts" />
        </q-list>
      </q-scroll-area>
      <UserCard name="Milan" status="online" />
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import UserCard from "../User/UserCard.vue";
import DrawerItem from "src/components/UI/DrawerItem.vue";
import SearchBar from "./SearchBar.vue";
const model = defineModel<boolean>({ default: false });
</script>
