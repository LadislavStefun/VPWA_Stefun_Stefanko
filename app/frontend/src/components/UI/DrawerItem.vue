<template>
  <q-item clickable v-ripple @click="handleClick" :active="isActive"
  active-class="bg-grey-3 text-black">
    <q-item-section avatar>
      <q-icon color="primary" name="contacts" />
    </q-item-section>

    <q-item-section>
      <div class="row items-center">
        <span>{{ name }}</span>
        <q-icon
          v-if="type !== null"
          color="primary"
          :name="type === 'public' ? 'public' : 'public_off'"
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
    <q-list style="min-width: 140px">
      <template v-if="isInvited">
        <q-item clickable v-close-popup @click="emit('acceptInvite')">
          <q-item-section>Accept invite</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="emit('declineInvite')">
          <q-item-section>Decline invite</q-item-section>
        </q-item>
      </template>

      <template v-else>
        <q-item v-if="isOwner" clickable v-close-popup @click="emit('delete')">
          <q-item-section>Delete channel</q-item-section>
        </q-item>

        <q-item v-else clickable v-close-popup @click="emit('leave')"> 
          <q-item-section>Leave channel</q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="showModal = true">
          <q-item-section>List Users</q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-menu>
</q-btn>
  </q-item>
  <UsersList v-model="showModal" />
</template>

<script setup lang="ts">
import type { ChannelType } from "src/types";
import UsersList from "./UsersList.vue";
import { ref } from "vue";
const showModal = ref(false);

interface dItem {
  name: string;
  isNew?: boolean;
  type?: ChannelType;
  isActive?: boolean;
  isInvited?: boolean;
  isOwner?: boolean;
}

withDefaults(defineProps<dItem>(), {
  isNew: false,
  type: "public",
  isActive: false,
  isInvited: false,
  isOwner: false,
});

const emit = defineEmits<{
  click: [];
  delete: [];
  leave: [];
  acceptInvite: [];
  declineInvite: [];
}>();

const handleClick = () => {
  emit("click");
};
</script>
