<template>
  <q-card flat bordered class="full-width">
    <q-card-section class="flex row justify-between items-center">
      <div>
        <AvatarStatus :status="currentStatus">
          <template #menu>
            <UserOptions
              :selected-status="currentStatus"
              @update:selected-status="handleStatusChange"
            />
          </template>
        </AvatarStatus>
        <span class="q-ml-md">{{ name }}</span>
      </div>
      <div class="q-ml-auto">
      <q-btn @click="isSettingsOpen = true" flat round color="primary"  size="sm" icon="settings" />
      <q-btn @click="handleLogout" flat round color="primary"  size="sm" icon="logout" />
    </div>
    </q-card-section>
  </q-card>
  <SettingsCard  v-model="isSettingsOpen"></SettingsCard>
</template>

<script setup lang="ts">
import AvatarStatus from "./AvatarStatus.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserOptions from "./UserMenu.vue";
import SettingsCard from "../UI/SettingsCard.vue";
const router = useRouter();
const isSettingsOpen = ref(false);

type UserStatus = "online" | "offline" | "dnd";

interface UserCardProps {
  name: string;
  status?: UserStatus;
}

const props = withDefaults(defineProps<UserCardProps>(), {
  status: "online",
});

const currentStatus = ref<UserStatus>(props.status);

const handleLogout = async () => {
  await router.push("/auth/login");
};

const handleStatusChange = (newStatus: UserStatus) => {
  currentStatus.value = newStatus;
};
</script>
