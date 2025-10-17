<template>
     <div class="chat-box q-pa-md"   >
      <q-scroll-area class="fit shadow-1 q-pa-md" >
      <q-infinite-scroll @load="onLoad" reverse class="q-pr-md">
      <div v-for="(item, index) in items" :key="index" class="caption" >
        <div >
      <ChatMessage name="me" :text="['hey, how are you?']" sent/>
      <ChatMessage name="Jane" typing />
      <ChatMessage name="Jane" :text="['<strong>@Martin</strong> doing fine, how r you?']" :tagged="true" />
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

<style scoped>
.chat-box {
  height: 100%;
  width: 100%;
  min-height: 0;
}
</style>
