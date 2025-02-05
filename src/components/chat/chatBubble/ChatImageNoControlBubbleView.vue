<script setup>

import {computed} from "vue";
import {useConfigStore} from "@/stores/useConfigStore.js";

const configStore = useConfigStore();

const props = defineProps(['message']);

const content = computed(() => {
  return JSON.parse(props.message.content.replaceAll("\n"," ").replaceAll("\r"," "));
});

</script>

<template>
  <div class="columns is-multiline is-mobile is-gapless">
    <div class="column">
      <div :class="['chat-message-bubble-canvas chat-message-bubble-canvas-left']">
        <span :class="[configStore.fontSize === 0 ? 'text-size-normal' : 'text-size-big']" v-html="content.prompts"></span>
      </div>
    </div>

    <figure class="column is-full mt-2" style="height: 250px">
      <img class="chat-image" :src="content.link">
    </figure>

    <div class="column mt-2" v-if="content.message !== ''">
      <div :class="['chat-message-bubble-canvas chat-message-bubble-canvas-left']">
        <span :class="[configStore.fontSize === 0 ? 'text-size-normal' : 'text-size-big']" v-html="content.message"></span>
      </div>
    </div>
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

.chat-image {
  border-radius: 10px;
  overflow: hidden;
  width: 250px;
  height: 250px;
}
</style>