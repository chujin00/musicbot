<script setup>
import {useConfigStore} from "@/stores/useConfigStore.js";
import {onMounted, watch} from "vue";
import {useManageStore} from "@/stores/useManageStore.js";
import {useChatStore} from "@/stores/useChatStore.js";
import FooterView from "@/components/base/FooterView.vue";

const configStore = useConfigStore();
const manageStore = useManageStore();

onMounted(async () => {
  configStore.tag = 'manage';

  if (manageStore.isValidation) {
    await refreshBtnTap();
  }
})

watch(() => manageStore.isValidation, (newValue, oldValue) => {
  if (newValue) {
    refreshBtnTap();
  }
})

async function logTestBtnTap() {
  if (configStore.isLoading) {
    return;
  }

  if (confirm('你確定要寫入測試數據嗎？\nAre you sure you want to write test data?')) {
    configStore.isLoading = true;
    const result = await manageStore.logRequest({
      message: '這是一條測試數據。'
    });
    configStore.isLoading = false;
    if (result.isSuccess) {
      await refreshBtnTap();
    } else {
      alert(result.data);
    }
  }
}

async function refreshBtnTap() {
  if (configStore.isLoading) {
    return;
  }

  configStore.isLoading = true;
  const result = await manageStore.requestAllLogs();
  let rows = result.rows;
  manageStore.logs = rows.reverse();
  configStore.isLoading = false;

  manageStore.refreshTime = (Date.now() / 1000 | 0);
}

async function deleteLogBtnTap(id) {
  if (configStore.isLoading) {
    return;
  }

  let name = prompt("要想刪除ID " + id.toString() + "的數據請輸入'DELETE'。\nTo delete all the data, please enter 'DELETE'.", "");
  if (name === "DELETE") {
    configStore.isLoading = true;
    const result = await manageStore.requestCleanByID(id);
    manageStore.logs = [];
    configStore.isLoading = false;
    alert(result);

    await refreshBtnTap();
  }
}

async function cleanAllBtnTap() {
  if (configStore.isLoading) {
    return;
  }

  let name = prompt("要想刪除全部數據請輸入'DELETE'。\nTo delete all the data, please enter 'DELETE'.", "");
  if (name === "DELETE") {
    configStore.isLoading = true;
    const result = await manageStore.requestCleanAll();
    manageStore.logs = [];
    configStore.isLoading = false;
    alert(result);

    await refreshBtnTap();
  }
}

function downloadAllLogs() {
  if (configStore.isLoading) {
    return;
  }

  manageStore.exportLogsToCSV(JSON.parse(JSON.stringify(manageStore.logs)));
}

function logoutBtnTap() {
  if (confirm('您確認退出管理嗎？(Are you sure you want to quit the management?)')) {
    manageStore.password = '';
    const chatStore = useChatStore();
    chatStore.messages = log.content.messages;
    manageStore.logs = [];
    manageStore.refreshTime = 0;
  }
}

function showConversationModal(log) {
  window.open(`/manage/chat/${log.id}`)
}

function convertCurrentConversation(log) {
  const content = JSON.parse(log.content);
  const userName = content.user_name;
  if (confirm("你确认要使用用户" + userName + "的对话来覆盖当前对话吗？(该操作不可逆，请注意保存当前对话。)" + "\n\nAre you sure you want to use the user '" + userName + "' conversation to cover the current conversation? This operation is irreversible, please pay attention to save the current conversation.)")) {
    const chatStore = useChatStore();
    chatStore.currentUsername = userName;
    chatStore.messages = JSON.parse(manageStore.messagesConvert(content.messages));

    alert("覆盖完成，请刷新对话页面。( The overlay is complete, please refresh the dialogue page. )")
  }
}

function jsonParse(content) {
  try {
    return JSON.parse(content);
  } catch (e) {
    return {
      user_name: "",
      control_method: "",
      messages: "",
    };
  }
}

</script>

<template>
<div class="container is-max-desktop my-3" v-if="manageStore.isValidation">
  <div class="columns is-mobile is-multiline is-gapless">
    <div class="column">
      <div class="buttons mx-1" style="float: left">
<!--        <button :class="['button is-danger', configStore.isLoading ? 'is-loading' : '']" style="color: white" @click="cleanAllBtnTap" >清空全部數據</button>-->
      </div>

      <div class="buttons mx-1" style="float: right">
<!--        <button :class="['button', configStore.isLoading ? 'is-loading' : '']" @click="logTestBtnTap">測試</button>-->
        <button :class="['button is-link', configStore.isLoading ? 'is-loading' : '']" style="color: white" @click="refreshBtnTap">刷新</button>
        <button :class="['button is-dark', configStore.isLoading ? 'is-loading' : '']" @click="downloadAllLogs">下載</button>
        <button class="button is-warning" @click="logoutBtnTap">退出管理</button>
      </div>
    </div>
    <div class="column is-full" v-if="manageStore.refreshTime !== 0">
      <p style="text-align: right">刷新時間：{{manageStore.timeConverter(manageStore.refreshTime)}}</p>
    </div>
    <div class="column is-full">
      <table v-if="manageStore.logs.length > 0" class="table is-fullwidth is-narrow">
        <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>User</th>
          <th>Method</th>
          <th>Content</th>
          <th>Operation</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(log, index) in manageStore.logs">
          <th>
            {{log.id}}
          </th>
          <td>
            {{manageStore.timeConverter(log.create_time)}}
          </td>
          <template v-if="log.content">
            <td>
              {{jsonParse(log.content).user_name}}
            </td>
            <td>
              {{ jsonParse(log.content).control_method === 2 ? 'User Control' : (jsonParse(log.content).control_method === 3 ? 'Hybrid' : 'No Image')}}
            </td>
            <td>
              <p style="max-height: 100px; overflow: scroll; word-wrap: anywhere">
                {{manageStore.messagesConvert(jsonParse(log.content).messages)}}
              </p>
            </td>
          </template>

          <td>
            <div class="columns is-multiline is-mobile is-gapless">
              <div class="column is-full">
                <button :class="['button is-small is-warning', configStore.isLoading ? 'is-loading' : '']" @click="showConversationModal(log)">對話詳情</button>
              </div>
              <div class="column mt-1  is-full">
                <button :class="['button is-danger is-small', configStore.isLoading ? 'is-loading' : '']" style="color: white" @click="convertCurrentConversation(log)">覆盖对话</button>
              </div>
<!--              <div class="column mt-1 is-full">-->
<!--                <button :class="['button is-small', configStore.isLoading ? 'is-loading' : '']" @click="deleteLogBtnTap(log.id)">刪除对话</button>-->
<!--              </div>-->
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <p class="py-6" style="text-align: center" v-else>暫時沒有數據。</p>
    </div>
  </div>
</div>

  <section class="hero is-fullheight-with-navbar" v-else>
    <div class="hero-body">
      <div class="container is-max-desktop">
        <p class="subtitle">請先輸入密鑰( Please enter the key first. )</p>
        <div class="control">
          <input class="input" type="text" placeholder="Key input" v-model="manageStore.password"/>
        </div>
      </div>
    </div>
  </section>

  <FooterView />
</template>

<style scoped>

</style>