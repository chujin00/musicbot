<script setup>
import ChatMessageBubbleView from "@/components/chat/chatBubble/ChatMessageBubbleView.vue";
import {useChatStore} from "@/stores/useChatStore.js";
import ChatImageNoControlBubbleView from "@/components/chat/chatBubble/ChatImageNoControlBubbleView.vue";
import ChatImageTagBubbleView from "@/components/chat/chatBubble/ChatImageTagBubbleView.vue";
import {nextTick, onMounted, ref, watch} from "vue";
import ChatLoadingBubbleView from "@/components/chat/chatBubble/ChatLoadingBubbleView.vue";
import {useConfigStore} from "@/stores/useConfigStore.js";
import {useManageStore} from "@/stores/useManageStore.js";

const configStore = useConfigStore();
const chatStore = useChatStore();
const manageStore = useManageStore();

watch(chatStore.messages, async (newValue, oldValue) => {
  scrollToBottom();
})

onMounted(() => {
  scrollToBottom();
})

const chatFlowCanvas = ref(null)
function scrollToBottom() {
  nextTick(() => {
    const el = chatFlowCanvas.value;
    el.scrollTop = el.scrollHeight;
    console.log("scrollToBottom");
  })
}

</script>

<template>
<div class="chat-scroll-canvas" ref="chatFlowCanvas">
  <div class="columns is-multiline is-mobile is-gapless">
    <div class="column is-full mb-2" v-for="(message, index) in chatStore.messages">
      <template v-if="message.role !== 'tool' && message.content !== null">
        <p class="my-2" style="text-align: center; font-size: 0.9rem; color: gray;">{{manageStore.timeConverter(message.create_time)}}</p>
        <ChatMessageBubbleView :message="message" :index="index" />
      </template>
      <div v-else>
        <template v-if="message.content !== null">
          <p class="my-2" style="text-align: center; font-size: 0.9rem; color: gray;">{{manageStore.timeConverter(message.create_time)}}</p>
          <template v-if="chatStore.contentToFrom(message).type === 'no-control-image'">
            <ChatImageNoControlBubbleView :message="message" />
          </template>
          <template v-if="chatStore.contentToFrom(message).type === 'tag-based-image'">
<!--            <ChatImageTagBubbleView :message="message" :show-switch-btn="index === chatStore.messages.length - 1"/>-->
            <ChatImageTagBubbleView :message="message" :show-switch-btn="true"/>
          </template>
        </template>
      </div>
    </div>
    <div class="column is-full mb-2" v-if="configStore.isLoading">
      <ChatLoadingBubbleView />
    </div>
  </div>

</div>
</template>

<style scoped>
.chat-scroll-canvas {
  background: #FAFAFA;
  overflow: scroll;
  width: 100%;
  height: calc(100% - 200px);

  padding: 20px;
}
</style>