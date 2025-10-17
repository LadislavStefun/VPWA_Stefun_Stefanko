<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="flex flex-center auth-bg">
        <div class="auth-container">
          <router-view />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.auth-bg {
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
  min-height: 100vh;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

</style>
