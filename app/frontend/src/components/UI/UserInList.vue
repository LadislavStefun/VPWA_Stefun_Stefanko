<template>
  <div class="col-12 col-sm-6 col-md-4">
    <q-card bordered flat class="q-pa-sm user-card">
      <div class="row items-center no-wrap">
        <AvatarStatus :status="status" />
        <div class="q-ml-md">
          <div class="text-subtitle2">{{ name }} - {{ role }}</div>
          <div class="text-caption text-grey-7">{{ email }}</div>
        </div>
      </div>
    </q-card>
  </div>
</template>
<script setup lang="ts">
import AvatarStatus from "../User/AvatarStatus.vue";

type UserStatus = "online" | "offline" | "dnd";

interface InformationAboutUsers {
  name: string;
  avatar: string;
  email: string;
  status: UserStatus;
  role: string;
}

defineProps<InformationAboutUsers>();
</script>
