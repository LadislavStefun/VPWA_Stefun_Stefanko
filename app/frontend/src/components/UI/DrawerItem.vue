<template>
  <q-item clickable v-ripple @click="handleClick">
    <q-item-section avatar>
      <q-icon color="primary" name="contacts" />
    </q-item-section>

    <q-item-section>
      <div class="row items-center">
        <span>{{ name }}</span>
        <q-icon
          v-if="isPrivate !== null"
          color="primary"
          :name="isPrivate ? 'public' : 'public_off'"
          size="xs"
          class="q-ml-md"
        />
      </div>
    </q-item-section>

    <q-item-section v-if="isNew" side>
      <q-badge text-color="white" label="New" />
    </q-item-section>

    <q-btn flat round dense icon="more_vert" @click.stop class="q-ml-xs">
      <q-menu anchor="top right" self="top left">
        <q-list style="min-width: 100px">
          <q-item clickable v-close-popup>
            <q-item-section>Delete channel</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>Leave channel</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="showModal = true">
            <q-item-section>List Users</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-item>
  <UsersList v-model="showModal" />
</template>

<script setup lang="ts">
import UsersList from "./UsersList.vue";
import { ref } from "vue";
const showModal = ref(false);

interface dItem {
  name: string;
  isNew?: boolean;
  isPrivate?: boolean;
}

withDefaults(defineProps<dItem>(), {
  isNew: false,
});

const emit = defineEmits<{
  click: [];
}>();

const handleClick = () => {
  emit("click");
};
</script>
