<script setup>
import {computed} from "vue";
import {useConfigStore} from "@/stores/useConfigStore.js";
import {useChatStore} from "@/stores/useChatStore.js";

const configStore = useConfigStore();
const chatStore = useChatStore();

const props = defineProps(['message', 'index']);

const index = computed(() => {
  return props.index;
});

const message = computed(() => {
  return props.message;
});

function showMoreFunctionsModal(index) {
  if (configStore.isLoading) {
    return
  }

  chatStore.showMoreFunctionsModal(index);
}

</script>

<template>
  <div :class="['chat-message-bubble-canvas', message.role === 'user' ? 'chat-message-bubble-canvas-right' : 'chat-message-bubble-canvas-left']" >
    <span :class="[configStore.fontSize === 0 ? 'text-size-normal' : 'text-size-big']" v-html="message.content"></span>
    <p :style="['text-align: right']" v-if="configStore.showMoreButton">
      <a @click="showMoreFunctionsModal(index)" style="color: black"><i class="bi bi-three-dots"></i></a>
    </p>
  </div>
</template>

<style scoped>
.chat-message-bubble-canvas {
  background: #E4E4E7;
  max-width: 80%;
  padding: 10px;
  border-radius: 10px;
}

.chat-message-bubble-canvas-left {
  float: left;
}

.chat-message-bubble-canvas-right {
  float: right;
  background: #E2EAFD;
}
</style>