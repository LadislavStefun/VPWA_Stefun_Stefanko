<template>
  <q-img :src="src" class="responsive-img q-mx-auto" fit="contain" />
</template>

<script setup lang="ts">
import logoImage from "../assets/marklogosquare.png";
interface Props {
  src?: string;
}

withDefaults(defineProps<Props>(), {
  src: logoImage,
});
</script>

<style scoped>
.responsive-img {
  width: 80px;
  height: 80px;
  max-width: 100%;
}
</style>
