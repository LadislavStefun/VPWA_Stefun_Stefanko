<template>
  <div class="input-bar">
    <q-input
      filled
      v-model="text"
      :dense="dense"
      class="input"
      placeholder="Say something..."
      style="width: 100%; height: auto;"

    />
    <q-btn color="primary" round class="q-ml-md input" unelevated icon="send"  />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const text = ref("");
const dense = ref(true);
</script>

<style scoped>
.input-bar {
  height: 5vh;
  margin: 0 auto;
  width: 98%;
  display: flex;
  align-items: center;
}
.input{
  margin-bottom:0px;
}


@media (max-width: 1439px) {
  .input { margin-bottom: 10px; }  /* väčší odstup na menších šírkach */
}


</style>

