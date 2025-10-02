<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg auth-card">
      <q-card-section class="text-center">
        <q-img :src="logoImage" class="responsive-img q-mx-auto" fit="contain" />
        <div class="login-title q-mt-md">Log In</div>
      </q-card-section>
      <q-form @submit.prevent="handleLogin">
        <q-card-section>
          <div class="q-gutter-md">
            <div>
              <label class="input-label">Email</label>
              <q-input
                v-model="email"
                dense
                outlined
                type="email"
                class="custom-input"
                lazy-rules
                :rules="[(val) => (val !== null && val !== '') || 'Email is required']"
              />
            </div>
            <div>
              <label class="input-label">Password</label>
              <q-input
                v-model="password"
                dense
                outlined
                type="password"
                class="custom-input"
                lazy-rules
                :rules="[(val) => (val !== null && val !== '') || 'Password is required']"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="flex flex-center">
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
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import logoImage from "../assets/marklogosquare.png";

const router = useRouter();

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  await router.push("/main");
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
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
}

.underlined-btn {
  text-decoration: underline !important;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
}
</style>
