<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavigationBar from "@/components/base/NavigationBar.vue";
import {useConfigStore} from "@/stores/useConfigStore.js";
import {onMounted, ref, watch} from "vue";
import VConsole from 'vconsole';

const configStore = useConfigStore();

function closeModal() {
  configStore.showSettingModal = false
}

onMounted(() => {
  if (configStore.controlMethod < 2) {
    configStore.controlMethod = 2
  }

  if (configStore.isDebug === true) {
    vConsole = new VConsole();
  }
})

let vConsole = null;

watch(() => configStore.isDebug, (newValue, oldValue) => {
  if (newValue === true) {
    if (vConsole !== null) {
      vConsole.destroy();
    }
    vConsole = new VConsole();
  } else {
    if (vConsole !== null) {
      vConsole.destroy();
      vConsole = null;
    }
  }
})

</script>

<template>
  <NavigationBar />

  <RouterView />

  <!-- Setting Modal  -->
  <div :class="[configStore.showSettingModal ? 'is-active' : '', 'modal']">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{configStore.language === 0 ? '設置' : 'Setting'}}</p>
        <!--        <button class="delete" aria-label="close"  @click="closeModal"></button>-->
      </header>
      <section class="modal-card-body">
        <div class="columns is-multiline">
          <div class="column is-full">
            <div class="field is-horizontal">
              <div class="field-label">
                <label class="label">語言<br>Language</label>
              </div>
              <div class="field-body">
                <div class="field is-narrow">
                  <div class="control">
                    <label class="radio mr-3">
                      <input type="radio" :value="0" v-model="configStore.language">
                      中文
                    </label>
                    <label class="radio">
                      <input type="radio" :value="1" v-model="configStore.language">
                      English
                    </label>
                  </div>
                  <p class="help">{{configStore.language === 0 ? '開啟新對話後生效。' : 'Effective after starting a new conversation.'}}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="column is-full">
            <div class="field is-horizontal">
              <div class="field-label">
                <label class="label">{{configStore.language === 0 ? '字體尺寸' : 'Font Size'}}</label>
              </div>
              <div class="field-body">
                <div class="field is-narrow">
                  <div class="control">
                    <label class="radio mr-3">
                      <input type="radio" :value="0" v-model="configStore.fontSize">
                      {{configStore.language === 0 ? '正常' : 'Normal'}}
                    </label>
                    <label class="radio">
                      <input type="radio" :value="1" v-model="configStore.fontSize">
                      {{configStore.language === 0 ? '放大' : 'Large'}}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="column is-full">
            <div class="field is-horizontal">
              <div class="field-label">
                <label class="label">{{configStore.language === 0 ? '圖片生成' : 'Image Generation'}}</label>
              </div>
              <div class="field-body">
                <div class="field is-narrow">
                  <div class="control">
                    <label class="radio mr-3">
                      <input type="radio" :value="false" v-model="configStore.useDallEGeneration">
                      {{configStore.language === 0 ? '模擬圖片' : 'Fake Image'}}
                    </label>
                    <label class="radio">
                      <input type="radio" :value="true" v-model="configStore.useDallEGeneration">
                      {{configStore.language === 0 ? 'OpenAI生成' : 'OpenAI Generation'}}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="column is-full" v-if="configStore.useDallEGeneration">
            <div class="field is-horizontal">
              <div class="field-label">
                <label class="label">{{configStore.language === 0 ? '圖片風格' : 'Image Style'}}</label>
              </div>
              <div class="field-body">
                <div class="field is-narrow">
                  <div class="control">
                    <label class="radio">
                      <input type="radio" value="vivid" v-model="configStore.dalleStyle">
                      Vivid
                    </label>
                    <label class="radio">
                      <input type="radio" value="natural" v-model="configStore.dalleStyle">
                      Natural
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

<!--          <div class="column is-full">-->
<!--            <div class="field is-horizontal">-->
<!--              <div class="field-label">-->
<!--                <label class="label">刷新按鈕<br>Refresh</label>-->
<!--              </div>-->
<!--              <div class="field-body">-->
<!--                <div class="field is-narrow">-->
<!--                  <div class="control">-->
<!--                    <label class="radio mr-3">-->
<!--                      <input type="radio" :value="true" v-model="configStore.showMoreButton">-->
<!--                      顯示( Display )-->
<!--                    </label>-->
<!--                    <label class="radio">-->
<!--                      <input type="radio" :value="false" v-model="configStore.showMoreButton">-->
<!--                      隱藏( Hide )-->
<!--                    </label>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

          <div class="column is-full">
            <div class="field is-horizontal">
              <div class="field-label">
                <label class="label">{{configStore.language === 0 ? '控制方式' : 'Control Method'}}</label>
              </div>
              <div class="field-body">
                <div class="field is-narrow">
                  <div class="control">
<!--                    <label class="radio mr-3">-->
<!--                      <input type="radio" :value="0" v-model="configStore.controlMethod">-->
<!--                      無控制( No )-->
<!--                    </label>-->
<!--                    <label class="radio">-->
<!--                      <input type="radio" :value="1" v-model="configStore.controlMethod">-->
<!--                      Tag控制( Tag )-->
<!--                    </label>-->
                    <label class="radio">
                      <input type="radio" :value="2" v-model="configStore.controlMethod">
                      {{configStore.language === 0 ? '用戶驅動' : 'User Driven'}}
                    </label>
                    <label class="radio">
                      <input type="radio" :value="3" v-model="configStore.controlMethod">
                      {{configStore.language === 0 ? '混合模式' : 'Hybrid'}}
                    </label>
<!--                    <label class="radio">-->
<!--                      <input type="radio" :value="4" v-model="configStore.controlMethod">-->
<!--                      {{configStore.language === 0 ? '無圖模式' : 'No Image'}}-->
<!--                    </label>-->
                  </div>
<!--                  <p class="help">{{configStore.language === 0 ? '開啟新對話後生效。' : 'Effective after starting a new conversation.'}}</p>-->
                </div>
              </div>
            </div>
          </div>

          <div class="column is-full">
            <div class="field is-horizontal">
              <div class="field-label">
                <label class="label">Temperature</label>
              </div>
              <div class="field-body">
                <div class="field is-narrow">
                  <div class="control">
                    <label class="radio mr-3">
                      <input type="radio" :value="0" v-model="configStore.gptTemperature">
                      0
                    </label>
                    <label class="radio mr-3">
                      <input type="radio" :value="0.2" v-model="configStore.gptTemperature">
                      0.2
                    </label>
                    <label class="radio mr-3">
                      <input type="radio" :value="0.4" v-model="configStore.gptTemperature">
                      0.4
                    </label>
                    <label class="radio mr-3">
                      <input type="radio" :value="0.6" v-model="configStore.gptTemperature">
                      0.6
                    </label>
                    <label class="radio mr-3">
                      <input type="radio" :value="0.8" v-model="configStore.gptTemperature">
                      0.8
                    </label>
                    <label class="radio">
                      <input type="radio" :value="1.0" v-model="configStore.gptTemperature">
                      1.0
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-full">
              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label">{{configStore.language === 0 ? '音樂按鈕' : 'Music Button'}}</label>
                </div>
                <div class="field-body">
                  <div class="field is-narrow">
                    <div class="control">
                      <label class="radio mr-3">
                        <input type="radio" :value="true" v-model="configStore.showMusicButton">
                        {{configStore.language === 0 ? '顯示' : 'Display'}}
                      </label>
                      <label class="radio">
                        <input type="radio" :value="false" v-model="configStore.showMusicButton">
                        {{configStore.language === 0 ? '隱藏' : 'Hide'}}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- <div class="column is-full">
              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label">Debug</label>
                </div>
                <div class="field-body">
                  <div class="field is-narrow">
                    <div class="control">
                      <label class="radio mr-3">
                        <input type="radio" :value="true" v-model="configStore.isDebug">
                        True
                      </label>
                      <label class="radio">
                        <input type="radio" :value="false" v-model="configStore.isDebug">
                        False
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->

            <div class="column is-full">
              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label">{{configStore.language === 0 ? '恢復默認' : 'Default'}}</label>
                </div>
                <div class="field-body">
                  <div class="field is-narrow">
                    <div class="control">
                        <button class="is-danger button is-small" style="color: white" @click="configStore.setDefaultSetting">{{configStore.language === 0 ? '恢復默認設置' : 'Restore default settings'}}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- <div class="column is-full">
              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label">{{configStore.language === 0 ? '管理' : 'Manage'}}</label>
                </div>
                <div class="field-body">
                  <div class="field is-narrow">
                    <div class="control">
                      <a class="button is-warning is-small" href="/manage" target="_blank">{{configStore.language === 0 ? '跳轉管理界面' : 'Jump to the management interface'}}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->

          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="closeModal">{{configStore.language === 0 ? '返回' : 'Back'}}</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>

</style>
