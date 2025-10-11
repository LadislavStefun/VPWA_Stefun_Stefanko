<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg auth-card">
      <q-card-section class="text-center q-pa-none">
        <q-img :src="logoImage" class="responsive-img q-mx-auto" fit="contain" />
        <div class="login-title q-mt-md">Register</div>
        <q-card-section class="q-pa-none">
          <q-stepper
            v-model="currentStep"
            alternative-labels
            ref="stepper"
            class="transparent"
            flat
            animated
            contracted
            keep-alive
          >
            <q-step
              :name="1"
              title="Info"
              icon="person"
              done-icon="none"
              :done="currentStep > 1"
            />
            <q-step
              :name="2"
              title="Email"
              icon="email"
              done-icon="none"
              :done="currentStep > 2"
            />
            <q-step
              :name="3"
              title="Password"
              icon="lock"
              done-icon="none"
              :done="currentStep > 3"
            />
            <q-step :name="4" title="Nick" icon="account_circle" done-icon="none" />
          </q-stepper>
        </q-card-section>
      </q-card-section>
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
              :rules="[(val: string) => (val !== null && val !== '') || 'First name is required']"
              @enter="nextStep"
            />
            <LabelInput
              label="Last name"
              v-model="lastName"
              input-type="text"
              :rules="[(val: string) => (val !== null && val !== '') || 'Last name is required']"
              @enter="nextStep"
            />
          </q-carousel-slide>
          <q-carousel-slide name="email" class="q-px-none">
            <LabelInput
              label="Email"
              v-model="email"
              input-type="email"
              hint="Use the full form of email"
              autofocus
              :rules="[
                (val: string) => (val !== null && val !== '') || 'Email is required',
                (val: string) => /.+@.+\..+/.test(val) || 'Email must be valid',
              ]"
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
              :rules="[
                (val: string) => (val !== null && val !== '') || 'Password is required',
                (val: string) => val.length >= 8 || 'Password must be at least 8 characters long',
              ]"
              @enter="nextStep"
            />
          </q-carousel-slide>
          <q-carousel-slide name="nickname" class="q-px-none">
            <LabelInput
              label="Nickname"
              v-model="nickname"
              input-type="text"
              autofocus
              :rules="[
                (val: string) => (val !== null && val !== '') || 'Nickname is required',
                (val: string) => val.length > 3 || 'Nickname must be at least 3 characters long',
              ]"
              @enter="handleRegister"
            />
          </q-carousel-slide>
        </q-carousel>

        <q-card-section class="q-pb-xs q-px-none">
          <div class="row justify-between q-gutter-sm">
            <q-btn
              v-if="currentStep > 1"
              flat
              color="primary"
              @click="previousStep"
              class="col"
            >
              Previous
            </q-btn>

            <q-btn
              v-if="currentStep < 4"
              color="primary"
              @click="nextStep"
              class="col"
              :disable="!canProceed"
            >
              Next
            </q-btn>

            <q-btn
              v-if="currentStep === 4"
              type="submit"
              color="primary"
              class="col"
              @click="handleRegister"
            >
              Register
            </q-btn>
          </div>
        </q-card-section>
        <q-card-section class="flex flex-center">
          <q-btn
            flat
            v-if="currentStep === 1"
            no-caps
            color="primary"
            class="underlined-btn"
            @click="handleLogin"
          >
            Back to Login
          </q-btn>
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { QStepper } from "quasar";
import logoImage from "../assets/marklogosquare.png";
import LabelInput from "src/components/UI/LabelInput.vue";

const router = useRouter();
const slide = ref("basicInfo");
const currentStep = ref(1);
const stepper = ref<QStepper>();
const formRef = ref();

const firstName = ref("");
const lastName = ref("");
const nickname = ref("");
const email = ref("");
const password = ref("");

const canProceed = ref(true);

const handleLogin = async () => {
  await router.push("/auth/login");
};

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
  const ok = await formRef.value?.validate();
  if (!ok) return;
  await router.push("/main");
};

const mappedSteps = {
  1: "basicInfo",
  2: "email",
  3: "password",
  4: "nickname",
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap");

.responsive-img {
  width: 80px;
  height: 80px;
  max-width: 100%;
}

.login-title {
  font-family: "Montserrat", sans-serif;
  color: var(--q-primary);
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
}

.input-label {
  display: block;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  color: var(--q-primary);
  margin-bottom: 6px;
  font-size: 0.9rem;
  text-align: left;
}

.custom-input {
  font-family: "Montserrat", sans-serif;
}

.auth-card {
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
}

.underlined-btn {
  text-decoration: underline !important;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
}
/* Remove annoying padding */
:deep(.q-panel-scroll) {
  display: none !important;
}

:deep(.q-stepper__content) {
  display: none !important;
}

:deep(.q-stepper) {
  background: transparent !important;
}

:deep(.q-stepper__header) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
