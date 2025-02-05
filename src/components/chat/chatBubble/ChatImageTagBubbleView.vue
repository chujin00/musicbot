<script setup>
import {computed} from "vue";
import {useChatStore} from "@/stores/useChatStore.js";
import {useConfigStore} from "@/stores/useConfigStore.js";
import {useImageStore} from "@/stores/useImageStore.js";

const configStore = useConfigStore();
const chatStore = useChatStore();
const imageStroe = useImageStore();

const props = defineProps(['message', 'showSwitchBtn']);

const content = computed(() => {
  return JSON.parse(props.message.content.replaceAll("\n"," ").replaceAll("\r"," "));
});

function tapTag(tag) {
  chatStore.addSendMessage(`請你加入：「${tag}」後重新生成圖片。`, true);
}

async function switchStyleAndGeneration() {
  if (configStore.dalleStyle === 'vivid') {
    configStore.dalleStyle = 'natural'
  } else {
    configStore.dalleStyle = 'vivid'
  }

  if (configStore.isLoading) {
    return
  }

  configStore.isLoading = true;
  const result = await imageStroe.generationImage(chatStore.messages);
  configStore.isLoading = false;

  if (result !== null) {
    await chatStore.addImageMessage(result);
  }
}

</script>

<template>
  <div class="columns is-multiline is-mobile is-gapless">

<!--    <div class="column">-->
<!--      <div :class="['chat-message-bubble-canvas chat-message-bubble-canvas-left']">-->
<!--        <span :class="[configStore.fontSize === 0 ? 'text-size-normal' : 'text-size-big']" v-html="content.prompts"></span>-->
<!--      </div>-->
<!--    </div>-->

    <figure class="column is-full  mt-2" style="height: 250px; position: relative;">
      <img class="chat-image" :src="content.link">
      <a class="button is-rounded is-small" style="position: absolute; bottom: 10px; left: 10px;" :href="content.link" target="_blank">{{ configStore.language === 0 ? '查看大圖' : 'View image'}}</a>
    </figure>

    <div class="column is-full mt-2" v-if="showSwitchBtn && configStore.controlMethod === 3">
      <div :class="['button', configStore.isLoading ? 'is-loading' : '', configStore.fontSize === 0 ? 'text-size-normal' : 'text-size-big']" @click="switchStyleAndGeneration"><i class="bi bi-plus-square mr-2"></i><span>{{configStore.language === 0 ? '切換風格' : 'Switch Styles'}}</span></div>
    </div>

    <div class="column mt-2" v-if="configStore.controlMethod === 1">
      <div class="columns is-multiline is-mobile is-gapless tag-canvas">
        <div class="column is-narrow"  v-for="suggestion in content.suggestions.slice(0, 10)">
          <button class="button is-small mr-2 mb-2" @click="tapTag(suggestion)"><span :class="[configStore.fontSize === 0 ? 'text-size-normal' : 'text-size-big']">{{suggestion}}</span></button>
        </div>
      </div>
    </div>

    <div class="column mt-2  is-full" v-if="content.message !== ''">
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

.tag-canvas {
  max-width: 250px;
}
</style>