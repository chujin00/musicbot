<script setup>
import ChatImageTagBubbleView from "@/components/chat/chatBubble/ChatImageTagBubbleView.vue";
import ChatMessageBubbleView from "@/components/chat/chatBubble/ChatMessageBubbleView.vue";
import ChatImageNoControlBubbleView from "@/components/chat/chatBubble/ChatImageNoControlBubbleView.vue";
import {useRoute} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {useManageStore} from "@/stores/useManageStore.js";
import {useChatStore} from "@/stores/useChatStore.js";
import {useConfigStore} from "@/stores/useConfigStore.js";
import {decode} from "js-base64";

const configStore = useConfigStore();
const chatStore = useChatStore();
const manageStore = useManageStore();
const route = useRoute();

onMounted(async () => {
  configStore.tag = 'manage';
})

const currentUsername = ref("");
const messages = ref([]);
const control_method = ref("");

// watch the params of the route to fetch the data again
watch(() => route.params.id, fetchLogData, { immediate: true })

function fetchLogData(id) {
  if (id === undefined) {
    return
  }

  const _log = manageStore.getLogFromLID(parseInt(id));

  if (_log === undefined) {
    return
  }

  const log = JSON.parse(_log.content);
  currentUsername.value = log.user_name;
  messages.value = JSON.parse(manageStore.messagesConvert(log.messages));

  if (log.control_method === 2) {
    control_method.value = "User driven";
  } else if (log.control_method === 3) {
    control_method.value = "Hybrid";
  } else if (log.control_method === 4) {
    control_method.value = "No Image";
  } else {
    control_method.value = "Undefined";
  }
}

</script>

<template>
  <div class="container is-max-desktop my-3 mb-6">
    <div class="card">
      <header class="card-header" style="position: sticky; top: 0; background-color: white">
        <p class="card-header-title">{{ currentUsername }} - Control Method: {{control_method}}</p>
        <button class="card-header-icon" aria-label="more options">
      <span class="icon">
        <i class="fas fa-angle-down" aria-hidden="true"></i>
      </span>
        </button>
      </header>
      <div class="card-content p-0">
        <template v-if="messages.length > 0">
          <div class="chat-scroll-canvas" ref="chatFlowCanvas">
            <div class="columns is-multiline is-mobile is-gapless">
              <div class="column is-full mb-2" v-for="(message, index) in messages">
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
                      <ChatImageTagBubbleView :message="message" :show-switch-btn="false"/>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <p class="m-5" style="text-align: center">
            沒有可顯示的對話內容
          </p>
        </template>
      </div>
      <footer class="card-footer">
      </footer>
    </div>
  </div>

</template>

<style scoped>
.chat-scroll-canvas {
  background: #FAFAFA;
  overflow: scroll;
  width: 100%;
  height: 100%;

  padding: 20px;
}

</style>