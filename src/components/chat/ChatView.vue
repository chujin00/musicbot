<script setup>
import ChatScrollView from "@/components/chat/ChatScrollView.vue";
import ChatInputView from "@/components/chat/ChatInputView.vue";
import {onMounted, ref, watch} from "vue";
import {useConfigStore} from "@/stores/useConfigStore.js";
import MusicSearchView from "@/components/music/MusicSearchView.vue";
import {useChatStore} from "@/stores/useChatStore.js";
import {useMusicStore} from "@/stores/useMusicStore.js";
import {useManageStore} from "@/stores/useManageStore.js";

const configStore = useConfigStore();
const chatStore = useChatStore();
const manageStore = useManageStore();

const tempUsername = ref('')


onMounted(() => {
  configStore.tag = 'home'

  if (chatStore.currentUsername !== configStore.accessCode) {
    chatStore.$reset();
    const musicStore = useMusicStore();
    musicStore.$reset();
  }

  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('accessCode')) {
    tempUsername.value = urlParams.get('accessCode');
  }
})

function confirmUserNameBtnTap() {
  const _username = tempUsername.value.trim();
  if (_username === '') {
    return;
  }

  if (_username.toLowerCase() !== configStore.accessCode) {
    alert('訪問碼有誤。\nAccess code is incorrect.');
    return;
  }
  
  chatStore.currentUsername = _username;
  tempUsername.value = '';

  if (chatStore.display_messages.length === 0) {
    chatStore.requestMessage(false);
  }

  const musicStore = useMusicStore();
  musicStore.isShow = true;
}

function regenerationMessage() {
  const index = chatStore.moreFunctionsModalIndex;

  if (confirm("確認要從此處重新生成嗎？")) {
    chatStore.regenerationMessage(index);
  }
}

function saveMessageContent() {
  const index = chatStore.moreFunctionsModalIndex;
  const content = chatStore.moreFunctionsContent;
  chatStore.modifiedMessageContent(index, content);
}


</script>

<template>
  <div class="chat-canvas container is-max-desktop" v-if="chatStore.currentUsername.trim() !== ''">
    <ChatScrollView />

    <ChatInputView />

    <MusicSearchView />

    <!-- More Functions Modal -->
    <div :class="['modal', chatStore.isShowMoreFunctionsModal ? 'is-active' : '']">
      <div class="modal-background" @click="chatStore.hideMoreFunctionsModal"></div>
      <div class="modal-card card">
        <section class="modal-card-body">
          <div class="control">
                <textarea
                    class="textarea has-fixed-size"
                    placeholder=""
                    v-model="chatStore.moreFunctionsContent"
                ></textarea>
          </div>
          <button class="button is-fullwidth is-dark my-3" @click="saveMessageContent();chatStore.hideMoreFunctionsModal();">{{configStore.language === 0 ? '保存内容' : 'Save the content'}}</button>
          <p class="buttons">
            <button class="button is-fullwidth is-warning" style="color: white" @click="regenerationMessage();chatStore.hideMoreFunctionsModal();">{{configStore.language === 0 ? '从此处重新生成' : 'Regenerate from here'}}</button>
            <button class="button is-fullwidth is-danger" style="color: white" @click="chatStore.hideMoreFunctionsModal">{{configStore.language === 0 ? '取消' : 'Cancel'}}</button>
          </p>
        </section>
      </div>
    </div>

    <!-- More Functions Modal -->
    <div :class="['modal', manageStore.googleFormUrl !== '' ? 'is-active' : '']">
      <div class="modal-background" @click="chatStore.hideMoreFunctionsModal"></div>
      <div class="modal-card card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ configStore.language === 0 ? '上傳成功！' : 'Uploaded successfully!' }}</p>
        </header>
        <section class="modal-card-body">
          <p>{{configStore.language === 0 ? '請點擊以下按鈕跳轉問卷：' : 'Please click the following button to jump to the questionnaire:'}}</p>
          <a class="button mt-2 is-warning" :href="manageStore.googleFormUrl" target="_blank">{{configStore.language === 0 ? '問卷填寫' : 'Questionnaire'}}</a>
          <p class="my-2">{{configStore.language === 0 ? '或複製以下連結：' : 'Or copy the following link:' }}</p>
          <p style="word-wrap:break-word;">{{ manageStore.googleFormUrl }}</p>
          <hr>
          <p>{{configStore.language === 0 ? '點擊以下按鈕跳轉「系統易用性」問卷：' : 'Click on the following button to jump to the system usability questionnaire:'}}</p>
          <a class="button mt-2 is-link" :href="'https://docs.google.com/forms/d/e/1FAIpQLScAvbTNE4bMVQdsvbZy56oAmvAZ5XOhCVSuJ9KD2oAo57CfYQ/viewform?usp=pp_url&entry.1898520237=' + chatStore.currentUsername + '&entry.1324800756=' + encodeURIComponent((configStore.controlMethod === 2 ? 'User Driven' : 'Hybrid'))" target="_blank">{{configStore.language === 0 ? '問卷填寫' : 'Questionnaire'}}</a>
        </section>
        <footer class="modal-card-foot">
          <div class="buttons">
            <button class="button is-danger" style="color: white" @click="manageStore.googleFormUrl = ''">{{configStore.language === 0 ? '關&nbsp;閉' : 'Close'}}</button>
          </div>
        </footer>
      </div>
    </div>
  </div>

  <section class="hero is-fullheight-with-navbar" v-else>
    <div class="hero-body">
      <div class="container is-max-desktop box">
        <!-- <p class="subtitle">請先輸入當前用戶的名字/ID<br>Please enter the name/ID of the current user first.</p> -->
        <p class="subtitle">請先輸入訪問碼<br>Please enter the access code first.</p>
        <div class="control">
          <input class="input" type="text" placeholder="" v-model="tempUsername" />
        </div>
        <div class="field has-addons mt-5 mb-0">
          <p class="control">
            <button :class="['button', configStore.controlMethod === 2 ? 'is-dark' : '']" @click="configStore.controlMethod = 2">
              <span class="icon is-small">
                <i class="bi bi-person-fill"></i>
              </span>
              <span>{{configStore.language === 0 ? '用戶驅動' : 'User Driven Method'}}</span>
            </button>
          </p>
          <p class="control">
            <button :class="['button', configStore.controlMethod === 3 ? 'is-dark' : '']" @click="configStore.controlMethod = 3">
              <span class="icon is-small">
                <i class="bi bi-robot"></i>
              </span>
              <span>{{configStore.language === 0 ? '混合模式' : 'Hybrid'}}</span>
            </button>
          </p>
<!--          <p class="control">-->
<!--            <button :class="['button', configStore.controlMethod === 4 ? 'is-dark' : '']" @click="configStore.controlMethod = 4">-->
<!--              <span class="icon is-small">-->
<!--                <i class="bi bi-ban"></i>-->
<!--              </span>-->
<!--              <span>{{configStore.language === 0 ? '無圖模式' : 'No Image'}}</span>-->
<!--            </button>-->
<!--          </p>-->
        </div>
        <!-- <p class="help mt-0" style="color: red">{{configStore.language === 0 ? '請務必確認當前模式。' : 'Be sure to confirm the current mode.'}}</p> -->
        <div class="field has-addons mt-3">
          <p class="control">
            <button :class="['button', configStore.language === 0 ? 'is-dark' : '']" @click="configStore.language = 0">
              <span>中文</span>
            </button>
          </p>
          <p class="control">
            <button :class="['button', configStore.language === 1 ? 'is-dark' : '']" @click="configStore.language = 1">
              <span>English</span>
            </button>
          </p>
        </div>
        <small>Copyright © 2024 <a href="https://pilab-hkbu.github.io" target="_blank">PI Lab</a>. All Rights Reserved.</small>
        <button class="button mt-3" @click="confirmUserNameBtnTap" style="float: right">{{configStore.language === 0 ? '開始' : 'Start'}}&nbsp;<i class="bi bi-arrow-right-square"></i></button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.chat-canvas {
  height: calc(100vh - 92px);
  border-radius: 10px;
  border: 1px solid #cecece;
  overflow: hidden;

  margin-top: 10px;
}
</style>