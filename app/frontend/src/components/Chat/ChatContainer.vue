<template>
     <div class="q-pr-xs q-pl-md row justify-center shadow-1 q-ma-md"   >
      <q-scroll-area class="chat-box" >
      <q-infinite-scroll @load="onLoad" reverse style="margin-right: 20px;">
      <div v-for="(item, index) in items" :key="index" class="caption" >
        <div >
      <ChatMessage name="me" :text="['hey, how are you?']" sent/>
      <ChatMessage name="Jane" typing/>
      <ChatMessage name="Jane" :text="['doing fine, how r you?']"/>
    </div>
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md" >
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <div v-for="(item, index) in items" :key="index" class="caption q-py-sm">
      <ChatMessage name="me" :text="['hey, how are you?']" sent/>
      <ChatMessage name="Jane" typing/>
      <ChatMessage name="Jane" :text="['doing fine, how r you?']"/>
      </div>
    </q-infinite-scroll></q-scroll-area>
    </div>
</template>


<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue'
import ChatMessage from 'src/components/Chat/ChatMessage.vue'

export default defineComponent({
  components: { ChatMessage },
  setup () {
    const items: Ref<Record<string, unknown>[]> = ref([{}, {}, {}, {}])

    const onLoad = (index: number, done: () => void) => {
      setTimeout(() => {
        items.value.push({}, {}, {})
        done()
      }, 2000)
    }

    return { items, onLoad }
  }
})
</script>
