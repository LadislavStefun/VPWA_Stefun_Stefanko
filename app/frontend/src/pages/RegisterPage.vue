<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg auth-card">
      <q-card-section class="text-center">
        <q-img :src="logoImage" class="responsive-img q-mx-auto" fit="contain" />
        <div class="login-title q-mt-md">Register</div>
      </q-card-section>
      <q-form @submit.prevent="handleLogin">
        <q-card-section>
          <div class="q-gutter-md">
            <div>
              <label class="input-label">First name</label>
              <q-input
                v-model="firstName"
                dense
                outlined
                type="text"
                class="custom-input"
              />
            </div>
            <div>
              <label class="input-label">Last name</label>
              <q-input
                v-model="lastName"
                dense
                outlined
                type="text"
                class="custom-input"
              />
            </div>
            <div>
              <label class="input-label">Nickname</label>
              <q-input
                v-model="nickname"
                dense
                outlined
                type="text"
                class="custom-input"
              />
            </div>
            <div>
              <label class="input-label">Email</label>
              <q-input v-model="email" dense outlined type="email" class="custom-input" />
            </div>

            <div>
              <label class="input-label">Password</label>
              <q-input
                v-model="password"
                dense
                outlined
                type="password"
                class="custom-input"
                to="/"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="flex flex-center">
          <q-btn type="submit" color="primary" class="full-width q-mt-md">Register</q-btn>
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

const firstName = ref("");
const lastName = ref("");
const nickname = ref("");
const email = ref("");
const password = ref("");

const handleLogin = async () => {
  console.log(email);
  console.log(password);
  await router.push("/");
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
