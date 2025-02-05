<script setup>
import {useTagStore} from "@/stores/useTagStore.js";
import {onMounted} from "vue";
import {useConfigStore} from "@/stores/useConfigStore.js";

const configStore = useConfigStore();
const tagStore = useTagStore();

onMounted(() => {
  configStore.tag = 'tag'
})

function generationTags() {
  configStore.isLoading = true;
  tagStore.requestTags(tagStore.message)
      .then((result) => {
        configStore.isLoading = false;
        tagStore.tags = result;
      });
}

function reset() {
  if (confirm("你確認要全部重置為默認嗎（包括Prompts）？")) {
    tagStore.$reset();
  }
}

</script>

<template>
  <div class="container is-max-desktop mt-3">
    <div class="columns is-multiline is-mobile">
      <div class="column is-full">
        <p class="title is-5">系統Prompt設置( System prompt settings )</p>
        <template v-if="configStore.language === 0">
          <textarea class="textarea-custom" placeholder="請輸入系統Prompts ( Please enter system prompts )" v-model="tagStore.systemMessagesCN.content" :disabled="configStore.isLoading"></textarea>
        </template>
        <template v-if="configStore.language === 1">
          <textarea class="textarea-custom" placeholder="請輸入系統Prompts ( Please enter system prompts )" v-model="tagStore.systemMessagesEN.content" :disabled="configStore.isLoading"></textarea>
        </template>
      </div>

      <div class="column is-full">
        <p class="title is-5">圖片/故事描述( Image/story description )</p>
        <textarea class="textarea-custom" placeholder="請輸入內容( Please enter content )" v-model="tagStore.message" :disabled="configStore.isLoading"></textarea>
      </div>

      <div class="column is-full">
        <div class="field is-grouped">
          <p class="control">
            <button :class="['button is-link', configStore.isLoading ? 'is-loading' : '']" @click="reset" :disabled="configStore.isLoading">全部重置( Reset all )</button>
          </p>
          <p class="control">
            <button :class="['button is-warning', configStore.isLoading ? 'is-loading' : '']" @click="generationTags" :disabled="configStore.isLoading">生成( Generate )</button>
          </p>
        </div>
      </div>

      <div class="column is-full">
        <p class="title is-5">生成Tags ( Generate tags )</p>
        <div class="columns is-multiline is-mobile is-gapless tag-canvas">
          <div class="column is-narrow"  v-for="tag in tagStore.tags">
            <button class="button mr-2 mb-2">{{tag}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea {
  font-size: 1.1rem;
  line-height: 1.6rem;

  border: none;
  overflow: auto;
  outline: none;

  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;

  resize: none; /*remove the resize handle on the bottom right*/

  background: rgba(255, 255, 255, 0);
}

.textarea-custom {
  width: 100%;
  padding: 15px;
  height: 200px;
  background: #FAFAFA;
  border-radius: 15px;
}
</style>