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

// 检查 message.content 是否包含 YouTube 链接
const isYouTubeLink = computed(() => {
  const youtubePattern = /(https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+|(?:v|e(?:mbed)?)\/(?:[A-Za-z0-9_-]+)))/i;
  return youtubePattern.test(message.value.content);
});

// 判断是否是Assistant的消息，并且是否需要播放粤语语音
const isAssistantMessage = computed(() => {
  return message.value.role === 'assistant';
});

// 触发播放粤语语音
function playCantoneseTTS(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-HK'; // 设置语言为粤语（香港）
  speechSynthesis.speak(utterance);
}

function showMoreFunctionsModal(index) {
  if (configStore.isLoading) {
    return;
  }

  chatStore.showMoreFunctionsModal(index);
}

</script>

<template>
  <div :class="['chat-message-bubble-canvas', message.role === 'user' ? 'chat-message-bubble-canvas-right' : 'chat-message-bubble-canvas-left']" >
    <!-- 如果是 YouTube 链接，则嵌入播放器 -->
    <div v-if="isYouTubeLink">
      <iframe
        :src="`https://www.youtube.com/embed/${message.content.match(/(?:v=|embed\/)([a-zA-Z0-9_-]+)/)[1]}`"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        width="100%"
        height="315"
      ></iframe>
    </div>
    <!-- 普通的文本内容 -->
    <span v-else :class="[configStore.fontSize === 0 ? 'text-size-normal' : 'text-size-big']" v-html="message.content"></span>

    <!-- 如果是 assistant 消息，显示播放语音按钮 -->
    <div v-if="isAssistantMessage">
      <button @click="playCantoneseTTS(message.content)" style="margin-top: 10px;" class="button is-small is-info">
        🎤 播放粤语语音
      </button>
    </div>

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

iframe {
  border-radius: 10px;
}

button {
  margin-top: 10px;
}
</style>