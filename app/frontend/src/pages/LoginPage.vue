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
