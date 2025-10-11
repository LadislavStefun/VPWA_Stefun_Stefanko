<template>
  <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" :name="iconName" />
          </q-item-section>

          <q-item-section>{{name}}</q-item-section>

          <q-item-section v-if="isNew" side >
          <q-badge text-color="white" label="New" />
          </q-item-section>
        </q-item>

</template>

<script setup lang="ts">
 interface dItem {
  iconName: string
  name: string
  isNew?:boolean
 }


withDefaults(defineProps<dItem>(), {
  isNew: false,
});
</script>
