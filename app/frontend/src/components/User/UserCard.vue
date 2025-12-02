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
        <span class="q-ml-md">{{ authStore.user?.nickName }}</span>
      </div>
      <div class="q-ml-auto">
        <q-btn
          @click="isCreateNewChannelOpen = true"
          flat
          round
          color="primary"
          size="sm"
          icon="add"
        />
        <q-btn
          @click="isSettingsOpen = true"
          flat
          round
          color="primary"
          size="sm"
          icon="settings"
        />
        <q-btn @click="handleLogout" flat round color="primary" size="sm" icon="logout" />
      </div>
    </q-card-section>
  </q-card>
  <SettingsCard v-model="isSettingsOpen"></SettingsCard>
  <CreateNewChannelCard v-model="isCreateNewChannelOpen"></CreateNewChannelCard>
</template>

<script setup lang="ts">
import AvatarStatus from "./AvatarStatus.vue";
import { ref, computed} from "vue";
import { useRouter } from "vue-router";
import UserOptions from "./UserMenu.vue";
import SettingsCard from "../UI/SettingsCard.vue";
import CreateNewChannelCard from "../UI/CreateChannelCard.vue";
import { useAuthStore, type UserStatus } from "src/store/authStore";
import ChannelSocketManager from 'src/services/ChannelSocketManager';

const router = useRouter();
const isSettingsOpen = ref(false);
const isCreateNewChannelOpen = ref(false);
const authStore = useAuthStore();

const currentStatus = computed<UserStatus>({
  get: () => authStore.userStatus,
  set: (val) => {
    authStore.setStatus(val);
  },
});

const handleLogout = async () => {
  await authStore.logout();
  await router.push("/auth/login");
};

const handleStatusChange = async (newStatus: UserStatus) => {
  authStore.setStatus(newStatus)

  if (newStatus === 'offline') {
    ChannelSocketManager.goOffline()
  } else if (newStatus === 'online') {
    await ChannelSocketManager.goOnline()
  }

}
</script>
