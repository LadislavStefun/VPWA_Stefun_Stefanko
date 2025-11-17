<template>
  <AuthCard title="Register" :is-form="false">
    <template #stepper>
      <FormStepper :current-step="currentStep" :steps="steps" />
    </template>

    <template #fields>
      <q-form ref="formRef" @keydown.enter.prevent>
        <q-carousel
          v-model="slide"
          transition-prev="scale"
          transition-next="scale"
          swipeable
          animated
          control-color="primary"
          padding
          class="transparent"
          height="auto"
        >
          <q-carousel-slide name="basicInfo" class="q-px-none">
            <LabelInput
              label="First name"
              v-model="firstName"
              input-type="text"
              :rules="commonRules.firstNameField"
              @enter="nextStep"
            />
            <LabelInput
              label="Last name"
              v-model="lastName"
              input-type="text"
              :rules="commonRules.lastNameField"
              @enter="nextStep"
            />
          </q-carousel-slide>
          <q-carousel-slide name="email" class="q-px-none">
            <LabelInput
              label="Email"
              v-model="email"
              input-type="email"
              hint="name@example.com"
              autofocus
              :rules="commonRules.emailField"
              @enter="nextStep"
            />
          </q-carousel-slide>
          <q-carousel-slide name="password" class="q-px-none">
            <LabelInput
              label="Password"
              v-model="password"
              input-type="password"
              autofocus
              hint="Password must be at least 8 characters long"
              :rules="commonRules.passwordField"
              @enter="nextStep"
            />
          </q-carousel-slide>
          <q-carousel-slide name="nickname" class="q-px-none">
            <LabelInput
              label="Nickname"
              v-model="nickname"
              input-type="text"
              autofocus
              :rules="commonRules.nicknameField"
              @enter="handleRegister"
            />
          </q-carousel-slide>
        </q-carousel>
      </q-form>
    </template>
    <template #navigation>
      <StepNavigation
        :show-previous="currentStep > 1"
        :show-next="currentStep < 4"
        :show-submit="currentStep === 4"
        :can-proceed="canProceed"
        submit-text="Register"
        @previous="previousStep"
        @next="nextStep"
        @submit="handleRegister"
      />
    </template>
    <template #buttons>
      <q-btn
        v-if="currentStep === 1"
        flat
        no-caps
        color="primary"
        class="underlined-btn"
        @click="handleLogin"
      >
        Back to Login
      </q-btn>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import axios from "axios";
import LabelInput from "src/components/UI/LabelInput.vue";
import { commonRules } from "src/utils/validation";
import AuthCard from "src/components/Auth/AuthCard.vue";
import FormStepper from "src/components/UI/FormStepper.vue";
import StepNavigation from "src/components/UI/StepNavigation.vue";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/store/authStore";
import authManager from "src/services/authManager";

const router = useRouter();
const $q = useQuasar();

const formRef = ref();

const currentStep = ref(1);
const slide = ref("basicInfo");

const firstName = ref("");
const lastName = ref("");
const nickname = ref("");
const email = ref("");
const password = ref("");

const isSubmitting = ref(false);
const canProceed = computed(() => !isSubmitting.value);

const handleLogin = async () => {
  await router.push("/auth/login");
};

const authStore = useAuthStore();

const nextStep = async () => {
  const ok = await formRef.value?.validate();
  if (!ok) return;
  currentStep.value = currentStep.value + 1 < 4 ? currentStep.value + 1 : 4;
  slide.value = mappedSteps[currentStep.value as keyof typeof mappedSteps];
};

const previousStep = () => {
  currentStep.value = currentStep.value - 1 > 1 ? currentStep.value - 1 : 1;
  slide.value = mappedSteps[currentStep.value as keyof typeof mappedSteps];
};

const handleRegister = async () => {
  if (isSubmitting.value) return;
  const ok = await formRef.value?.validate();
  if (!ok) return;

  isSubmitting.value = true;

  try {
    const response = await api.post("/register", {
      firstName: firstName.value,
      lastName: lastName.value,
      nickName: nickname.value,
      email: email.value,
      password: password.value,
    });

    $q.notify({
      type: "positive",
      message: "Registration successful",
    });

    authManager.setToken(response.data.token);
    authStore.setUser(response.data.user);

    await router.push("/main");
  } catch (error: unknown) {
    let message = "Failed to register";

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

const steps = [
  { name: 1, title: "Info", icon: "person" },
  { name: 2, title: "Email", icon: "email" },
  { name: 3, title: "Password", icon: "lock" },
  { name: 4, title: "Nick", icon: "account_circle" },
];

const mappedSteps = {
  1: "basicInfo",
  2: "email",
  3: "password",
  4: "nickname",
} as const;
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap");

.underlined-btn {
  text-decoration: underline !important;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
}
</style>
