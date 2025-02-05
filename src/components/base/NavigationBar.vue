<script setup>
import {useChatStore} from "@/stores/useChatStore.js";
import {useConfigStore} from "@/stores/useConfigStore.js";
import {onMounted} from "vue";
import {useMusicStore} from "@/stores/useMusicStore.js";
import {useManageStore} from "@/stores/useManageStore.js";
import {encode} from "js-base64";

const configStore = useConfigStore();
const chatStore = useChatStore();

onMounted(() => {
  document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });

  });
})

async function saveMessages() {
  if (configStore.isLoading) {
    return
  }

  if (confirm("你確定要上傳用戶" + chatStore.currentUsername + "的當前對話紀錄嗎？" + "\nAre you sure you want to upload the current conversation record of user " + chatStore.currentUsername + "？")) {
    const manageStore = useManageStore();

    configStore.isLoading = true;
    const content = {
      user_name: chatStore.currentUsername,
      control_method: configStore.controlMethod,
      messages: encode(JSON.stringify(chatStore.messages))
    };

    const result = await manageStore.logRequest(content);
    configStore.isLoading = false;

    if (result.isSuccess) {
      let parameters = "entry.2130057741=" + encodeURIComponent(chatStore.currentUsername) + "&entry.543677286=" + encodeURIComponent((configStore.controlMethod === 2 ? 'User Driven' : 'Hybrid')) + "&entry.2043235926=" + encodeURIComponent(result.data);
      let url = "https://docs.google.com/forms/d/e/1FAIpQLScX89GwPS24dDVLRi7vrDwWAWQPUiJTPJYMGj13P3WPy3FoBw/viewform?usp=pp_url&" + parameters;

      if (configStore.controlMethod === 4) {
        url = "https://docs.google.com/forms/d/e/1FAIpQLSdKW2OFCbrFGHuGpDmb6k8-u-6g_-PzNl-yZr7Z8_TVjbCCtA/viewform?usp=pp_url&" + parameters;
      }

      manageStore.googleFormUrl = url
    } else {
      alert(result.data);
    }
  }
}

function openQuestionnaireWithNoParameters() {
  const url = "https://docs.google.com/forms/d/e/1FAIpQLScX89GwPS24dDVLRi7vrDwWAWQPUiJTPJYMGj13P3WPy3FoBw/viewform?usp=pp_url&entry.2130057741=" + encodeURIComponent(chatStore.currentUsername) + "&entry.543677286=" + encodeURIComponent((configStore.controlMethod === 2 ? 'User Driven' : 'Hybrid')) + "&entry.2043235926=";
  openNewTag(url);
}

function openNewTag(url) {
  let a = document. createElement ('a');
  a. setAttribute('href', url);
  a. setAttribute( 'style', 'display: none');
  a. setAttribute( 'target', '_blank');
  document.body.appendChild(a);
  a.click();
  a.parentNode.removeChild(a);
}

function cleanAll() {
  if (confirm("你確認要清空當前對話嗎？\nAre you sure you want to clear the current conversation?")) {
    chatStore.cleanAll();

    const musicStore = useMusicStore();
    musicStore.$reset();

    configStore.dalleStyle = 'vivid';
  }
}

</script>

<template>
<div class="container is-max-desktop">
  <nav class="navbar is-white" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">

      <router-link v-if="configStore.tag === 'home'" :class="['navbar-item', configStore.tag === 'home' ? 'is-active' : '' ]" :to="{ name: 'home'}">Music Chatbot</router-link>

      <router-link v-if="configStore.tag === 'manage'" :class="['navbar-item', configStore.tag === 'manage' ? 'is-active' : '' ]" :to="{ name: 'manage'}">Manage</router-link>

      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
<!--        <router-link :class="['navbar-item', configStore.tag === 'tag' ? 'is-active' : '' ]" :to="{ name: 'tag'}">Tags</router-link>-->
      </div>

      <div class="navbar-end">
        <div class="navbar-item px-1" v-if="configStore.isDebug">
          <div :class="['button is-small is-dark']" @click="openQuestionnaireWithNoParameters">{{configStore.language === 0 ? '打開問卷' : 'Open Questionnaire'}}</div>
        </div>
        <div class="navbar-item px-1" v-if="configStore.isDebug">
          <a :class="['button is-small is-dark']" href="https://forms.gle/aZKR7os97SorpvRp9" target="_blank">{{configStore.language === 0 ? '應急日誌' : 'Emergency log'}}</a>
        </div>
        <!-- <div class="navbar-item px-1" v-if="configStore.tag === 'home' && chatStore.currentUsername !== ''">
          <button :class="['button is-small is-link', configStore.isLoading ? 'is-loading' : '']" @click="saveMessages" :disabled="configStore.isLoading">
            {{configStore.language === 0 ? '上傳對話' : 'Upload the conversation'}}
          </button>
        </div> -->
        <div class="navbar-item px-1" v-if="configStore.tag === 'home'">
          <button :class="['button is-small is-danger', configStore.isLoading ? 'is-loading' : '']" style="color: white" @click="cleanAll" :disabled="configStore.isLoading">
            {{configStore.language === 0 ? '開啟新對話' : 'New chat'}}
          </button>
        </div>
        <div class="navbar-item px-1">
          <button :class="['button is-small', configStore.isLoading ? 'is-loading' : '']" @click="configStore.showSettingModal = true" :disabled="configStore.isLoading">
            {{configStore.language === 0 ? '設置' : 'Setting'}}
          </button>
        </div>
      </div>
    </div>
  </nav>
</div>
</template>

<style scoped>

</style>