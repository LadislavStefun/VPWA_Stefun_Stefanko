<template>
  <q-page class="flex flex-center">
    <AuthCard title="Log In" @submit="handleLogin">
      <template #fields>
        <LabelInput
          label="Email"
          v-model="email"
          inputType="email"
          lazy-rules
          :rules="[(val: string) => (val !== null && val !== '') || 'Email is required']"
        />
        <LabelInput
          label="Password"
          v-model="password"
          inputType="password"
          lazy-rules
          :rules="[(val: string) => (val !== null && val !== '') || 'Password is required']"
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
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthCard from "src/components/AuthCard.vue";
import LabelInput from "src/components/LabelInput.vue";

const router = useRouter();

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  await router.push("/main");
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
