<template>
  <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" :name="iconName" />
          </q-item-section>

          <q-item-section>{{name}}</q-item-section>

          <q-item-section v-if="isNew" side >
          <q-badge text-color="white" label="New" />
          </q-item-section>

        <q-btn  flat round dense icon="more_vert" @click.stop class="q-ml-xs"  >
        <q-menu anchor="top right" self="top left">
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>Delete channel</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Leave channel</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>List users</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

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
