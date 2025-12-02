<template>
  <q-dialog v-model="modalwin">
    <q-card class="users-dialog q-pa-md">
      <q-card-section> <div class="text-h6">List of users</div></q-card-section>
      <q-card-section class="q-pt-none">
        <div v-if="loading" class="row items-center q-gutter-sm">
          <q-spinner size="24px" />
          <span>Loading users…</span>
        </div>

        <div v-else-if="error" >
          {{ error }}
        </div>

        <div v-else >
          <UserInList
            v-for="user in members"
            :key="user.id"
            :name="user.nickName"
            :email="user.email ?? ''"
            :avatar="user.nickName"
            :role="user.role"
            :status="'online'"
          />
        </div>
      </q-card-section>
      <q-card-actions class="bg-white text-teal">
        <q-btn flat label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import UserInList from "./UserInList.vue";
import { ref, watch } from 'vue';
import { useChannelsStore } from 'src/store/channelStore';
import ChannelSocketManager from 'src/services/ChannelSocketManager';
const modalwin = defineModel<boolean>({ default: false });


const channelsStore = useChannelsStore()

type ChannelMember = {
  id: number
  nickName: string
  email: string | null
  role: 'owner' | 'member'
  status: string
}

const members = ref<ChannelMember[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

async function loadMembers() {
  const activeId = channelsStore.activeChannelId

  if (!activeId) {
    members.value = []
    return
  }

  loading.value = true
  error.value = null

  try {
    const list = await ChannelSocketManager.fetchMembers(Number(activeId))
    members.value = list
  } catch (e) {
    console.error(e)
    error.value = 'Failed to load members'
  } finally {
    loading.value = false
  }
}

watch(
  () => modalwin.value,
  (open) => {
    if (open) {
      void loadMembers()
    }
  }
)
</script>

<style scoped>
.users-dialog {
  width: 700px;
  max-width: 80vw;
}
</style>
