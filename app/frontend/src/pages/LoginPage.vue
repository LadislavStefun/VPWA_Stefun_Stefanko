<template>
  <AuthCard title="Log In" @submit="handleLogin">
    <template #fields>
      <LabelInput
        label="Email"
        v-model="email"
        inputType="email"
        :rules="commonRules.emailField"
      />
      <LabelInput
        label="Password"
        v-model="password"
        inputType="password"
        :rules="commonRules.requiredTextField('Password')"
      />
    </template>
    <template #buttons>
      <q-btn type="submit" color="primary" class="full-width q-mt-md">Log In</q-btn>
      <q-btn
        flat
        no-caps
        color="primary"
        class="underlined-btn q-mt-md"
        to="/auth/register"
      >
        Create new account
      </q-btn>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthCard from "src/components/Auth/AuthCard.vue";
import LabelInput from "src/components/UI/LabelInput.vue";
import { commonRules } from "src/utils/validation";
import axios from "axios";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/store/authStore";
import authManager from "src/services/authManager";
import ChannelSocketManager from "src/services/ChannelSocketManager";


const $q = useQuasar();
import { api } from "src/boot/axios";

const router = useRouter();

const email = ref("");
const password = ref("");
const isSubmitting = ref(false);

const authStore = useAuthStore();

const handleLogin = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const response = await api.post("/login", {
      email: email.value,
      password: password.value,
    });
    authManager.setToken(response.data.token);
    authStore.setUser(response.data.user);
    if (authStore.userStatus === 'offline') {
      ChannelSocketManager.goOffline();
    } else {
      void ChannelSocketManager.goOnline();
    }

    $q.notify({
      type: "positive",
      message: "Login successful",
    });

    await router.push("/main");
  } catch (error: unknown) {
    let message = "Failed to login";

    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        message;
    }

    $q.notify({
      type: "negative",
      message,
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap");
.underlined-btn {
  text-decoration: underline !important;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
}
</style>
