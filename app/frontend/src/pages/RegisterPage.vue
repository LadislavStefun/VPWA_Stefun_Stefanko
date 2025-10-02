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
            <q-step :name="1" title="Info" icon="person" :done="currentStep > 1" />
            <q-step :name="2" title="Email" icon="email" :done="currentStep > 2" />
            <q-step :name="3" title="Password" icon="lock" :done="currentStep > 3" />
            <q-step :name="4" title="Nick" icon="account_circle" />
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
            <label class="input-label">First name</label>
            <q-input
              v-model="firstName"
              dense
              outlined
              type="text"
              class="custom-input"
              lazy-rules
              :rules="[(val) => (val !== null && val !== '') || 'First name is required']"
              @keyup.enter="nextStep"
            />
            <label class="input-label">Last name</label>
            <q-input
              v-model="lastName"
              dense
              outlined
              type="text"
              class="custom-input"
              lazy-rules
              :rules="[(val) => (val !== null && val !== '') || 'Last name is required']"
              @keyup.enter="nextStep"
            />
          </q-carousel-slide>
          <q-carousel-slide name="email" class="q-px-none">
            <label class="input-label">Email</label>
            <q-input
              v-model="email"
              dense
              outlined
              type="email"
              class="custom-input"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Email is required',
                (val) => /.+@.+\..+/.test(val) || 'Email must be valid',
              ]"
              @keyup.enter.stop="nextStep"
            />
          </q-carousel-slide>
          <q-carousel-slide name="password" class="q-px-none">
            <label class="input-label">Password</label>
            <q-input
              v-model="password"
              dense
              outlined
              type="password"
              class="custom-input"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Password is requiered',
                (val) => val.length > 8 || 'Password must be at least 8 characters long',
              ]"
              @keyup.enter="nextStep"
            />
          </q-carousel-slide>
          <q-carousel-slide name="nickname" class="q-px-none">
            <label class="input-label">Nickname</label>
            <q-input
              v-model="nickname"
              dense
              outlined
              type="text"
              class="custom-input"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Nickname is required',
                (val) => val.length > 3 || 'Nickname must be at least 3 characters long',
              ]"
              @keyup.enter="handleLogin"
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

            <q-btn v-if="currentStep === 4" type="submit" color="primary" class="col" @click="handleLogin"> 
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
            to="/auth/login"
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
  await router.push("/main");
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
