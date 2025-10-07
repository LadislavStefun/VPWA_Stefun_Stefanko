<template>
    <div class="q-pa-md row justify-center" >
      <q-infinite-scroll @load="onLoad" class="chat-box" :offset="250">
      <div v-for="(item, index) in items" :key="index" class="caption" >
        <div >
      <q-chat-message name="me" :text="['hey, how are you?']" sent />
      <q-chat-message name="Jane" bg-color="grey-4" text-color="dark">
      <div class="row items-center no-wrap">
      <div class="">Typing </div>
      <q-spinner-dots size="20px" class="q-ml-xs" />
      </div>
      </q-chat-message>

      <q-chat-message name="Jane" bg-color="primary" text-color="white" :text="['doing fine, how r you?']"/>

    </div>
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue'

export default defineComponent({
  setup () {
    const items: Ref<Record<string, unknown>[]> = ref([{}, {}, {}, {}, {}, {}])

    const onLoad = (index: number, done: () => void) => {
      setTimeout(() => {
        items.value.push({}, {}, {})
        done()
      }, 2000)
    }

    return {
      items,
      onLoad
    }
  }
})
</script>


