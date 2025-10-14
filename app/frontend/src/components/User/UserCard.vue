<template>
  <q-card flat bordered class="full-width">
    <q-card-section class="flex col justify-between items-center">
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
      <q-btn @click="handleLogout" flat round color="primary" icon="logout" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import AvatarStatus from "./AvatarStatus.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserOptions from "./UserOptions.vue";
const router = useRouter();

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
