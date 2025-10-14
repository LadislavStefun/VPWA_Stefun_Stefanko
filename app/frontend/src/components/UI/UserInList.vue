<template>
<div class="col-12 col-sm-6 col-md-4">
            <q-card bordered flat class="q-pa-sm user-card">
              <div class="row items-center no-wrap">
                <q-avatar size="42px" color="primary" text-color="white">{{avatar}}</q-avatar>
                <div class="q-ml-md">
                  <div class="text-subtitle2">{{ name }}</div>
                  <div class="text-caption text-grey-7">{{ email }}</div>
                </div>

              </div>
            </q-card>
</div>
</template>
<script setup lang="ts">

 interface InformationAboutUsers {
  name: string
  avatar:string
  email:string
 }

defineProps<InformationAboutUsers>();

</script>
