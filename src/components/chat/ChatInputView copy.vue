<script setup>
import {onMounted, ref, watch} from "vue";
import {useConfigStore} from "@/stores/useConfigStore.js";
import {useChatStore} from "@/stores/useChatStore.js";
import {useImageStore} from "@/stores/useImageStore.js";
import {useMusicStore} from "@/stores/useMusicStore.js";

const configStore = useConfigStore();
const chatStore = useChatStore();
const imageStroe = useImageStore();

const message = ref("");

function sendMessage() {
  const _message = message.value.trim();
  message.value = "";
  if (_message === "") {
    return
  }

  chatStore.addSendMessage(_message, false);
}

async function generationImage() {
  if (confirm("你確定要生成圖片嗎？\nAre you sure you want to generate photos?")) {
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
}

function searchSongModalShow() {
  const musicStore = useMusicStore();
  musicStore.isShow = true;
}

</script>

<template>
<div class="chat-input-canvas">
  <div class="chat-input-tools">
    <span style="float: left; height: 40px; line-height: 40px;margin-left: 10px; color: gray">{{configStore.language === 0 ? '當前用戶：' : 'Current User: '}}{{chatStore.currentUsername}}</span>
    <button :class="['button is-small chat-input-tools-button is-warning', configStore.isLoading ? 'is-loading' : '']" v-if="chatStore.canGenerationImage === true" :disabled="configStore.isLoading" @click="generationImage">{{ configStore.language === 0 ? '為此刻記憶生成圖片':'Generate a picture of the memory' }}</button>
    <button :class="['button is-small chat-input-tools-button is-link mr-2', configStore.isLoading ? 'is-loading' : '']" :disabled="configStore.isLoading" v-if="configStore.showMusicButton" @click="searchSongModalShow">{{configStore.language === 0 ? '歌曲搜索' : 'Song search'}}</button>
  </div>

  <textarea class="chat-input-textarea" :placeholder="configStore.language === 0 ? '請輸入內容' : 'Please enter content'" v-model="message" :disabled="configStore.isLoading"></textarea>

  <button :class="['button chat-input-send-button is-success', configStore.isLoading ? 'is-loading' : '']" style="color: white" @click="sendMessage" :disabled="configStore.isLoading">{{configStore.language === 0 ? '發送' : 'Send'}}</button>

</div>
</template>

<style scoped>
.chat-input-canvas {
  position: sticky;
  bottom: 0;
  width: 100%;
  height: 200px;
  border-top: 1px solid #cecece;
}

.chat-input-tools {
  height: 40px;
  border-bottom: 1px solid #cecece;
  background: white;
}

.chat-input-tools-button {
  margin-top: 5px;
  float: right;
  right: 10px;
}

textarea {
  font-size: 1.1rem;

  border: none;
  overflow: auto;
  outline: none;

  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;

  resize: none; /*remove the resize handle on the bottom right*/

  background: rgba(255, 255, 255, 0);
}

.chat-input-textarea {
  padding: 10px 10px 10px;

  width: 100%;
  height: calc(100% - 95px);
}

.chat-input-send-button {
  float: right;
  top: 0;
  bottom: 10px;
  right: 10px;
  min-width: 120px;
}
</style>