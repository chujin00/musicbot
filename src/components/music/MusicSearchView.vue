<script setup>
import {nextTick, onMounted, ref, watch} from "vue";
import {useMusicStore} from "@/stores/useMusicStore.js";
import {useConfigStore} from "@/stores/useConfigStore.js";

const configStore = useConfigStore();
const musicStore = useMusicStore();

onMounted(() => {
  musicStore.requestToken(() => {

  });
  musicStore.currentMusic = null;
})

function search() {
  musicStore.search(musicStore.keywords, 10)
      .then((result) => {
        musicStore.items = result;
      })
}

let audioController = ref(null);
let musicURL = ref("");

watch(()=>musicStore.currentMusic, async (newValue, oldValue) => {
  musicURL = newValue.preview_url;
})
function playMusic(item) {
  if (musicStore.currentMusic !== item) {
    audioController.value.pause();
    musicStore.currentMusic = item;
    musicStore.isPlaying = true;
  } else {
    musicStore.isPlaying = !musicStore.isPlaying
  }

  nextTick(() => {
    if (musicStore.isPlaying) {
      audioController.value.play();
    } else {
      audioController.value.pause();
    }
  })
}

function updatePaused(event) {
  musicStore.isPlaying = event.type === "playing";
}

function hiddenBtnTap() {
  musicStore.isShow = false;
  nextTick(()=>{
    audioController.value.pause();
  })
}

</script>

<template>
  <audio ref="audioController" @playing="updatePaused" @pause="updatePaused" controls hidden :src="musicURL" />
  <div :class="['modal', musicStore.isShow ? 'is-active' : '']">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{configStore.language === 0 ? '歌曲搜索' : 'Song search'}}</p>
        <button class="delete" aria-label="close" @click="hiddenBtnTap"></button>
      </header>
      <section class="modal-card-body">
        <div class="music_canvas">
          <div class="columns is-multiline is-vcentered p-3">
            <div class="column is-full">
              <div class="field has-addons">
                <div class="control is-expanded">
                  <input class="input" v-model="musicStore.keywords" type="text" :placeholder="configStore.language === 0 ? '請輸入您想搜索的歌曲' : 'Please enter the song you want to search for.'" @keyup.enter="search">
                </div>
                <div class="control">
                  <button :class="['button', musicStore.isLoading ? 'is-loading' : '']" :disabled="musicStore.isLoading" @click="search">
                    {{configStore.language === 0 ? '搜索' : 'Search'}}
                  </button>
                </div>
              </div>
              <p class="mt-2" style="text-align: center;">{{configStore.language === 0 ? '找不到你想要的歌曲 / 想聆聽完整版？ 試試' : 'Can\'t find the song you want / want to listen to the full version? Try'}} <a class="button is-small" :href="'https://www.youtube.com/results?search_query=' + encodeURIComponent(musicStore.keywords)" target="_blank">YouTube</a></p>
            </div>

            <div class="column is-full music_list_canvas" v-if="musicStore.items">
              <table class="table is-hoverable is-fullwidth">
                <thead>
                <tr>
                  <th>{{configStore.language === 0 ? '歌曲名' : 'Title'}}</th>
                  <th class="is-hidden-touch">{{configStore.language === 0 ? '專輯' : 'Album'}}</th>
                  <th class="is-hidden-touch">{{configStore.language === 0 ? '日期' : 'Date'}}</th>
                  <th>{{configStore.language === 0 ? '時長' : 'Length'}}</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr  v-for="item in musicStore.items" style="cursor: pointer" @click="playMusic(item)">
                  <td>
                    <div class="columns is-gapless is-mobile">
                      <div class="column is-narrow mr-2" style="position: relative">
                        <div v-if="musicStore.currentMusic === item" style="position: absolute; background: rgba(0,0,0, 0.4); width: 45px; height: 45px; border-radius: 3px ">
                          <i :class="['bi', musicStore.isPlaying ? 'bi-pause-fill': 'bi-play-fill']" style="color: white; position: absolute; width: 20px; height: 20px; margin-left: 50%; left: -7px; margin-top: 50%; top: -12px"></i>
                        </div>
                        <img :src="item.album.images[0].url" alt="" style="width: 45px; height: 45px; object-fit: cover; border-radius: 3px">
                      </div>
                      <div class="column">
                        <p :class="[musicStore.currentMusic === item ? 'is-playing' : '']">{{item.name}}</p>
                        <p style="font-size: 0.8rem; color: gray"><span v-for="(artist, index) in item.artists">{{artist.name}}<template v-if="index < item.artists.length - 1">, &nbsp</template></span></p>
                      </div>
                    </div>
                  </td>
                  <td class="is-hidden-touch">
                    <p style="font-size: 0.8rem">{{item.album.name}}</p>
                  </td>
                  <td class="is-hidden-touch">
                    <p>{{item.album.release_date}}</p>
                  </td>
                  <td>
                    <p v-html="item.duration_ms"></p>
                  </td>
                  <td>

                  </td>
                </tr>
                </tbody>
              </table>
              <p style="text-align: right; color: gray"><small>Powered by Spotify.</small></p>
              <p class="mt-4" style="text-align: center;">{{configStore.language === 0 ? '找不到你想要的歌曲 / 想聆聽完整版？ 試試' : 'Can\'t find the song you want / want to listen to the full version? Try'}} <a class="button is-small" :href="'https://www.youtube.com/results?search_query=' + encodeURIComponent(musicStore.keywords)" target="_blank">YouTube</a></p>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button" @click="hiddenBtnTap">{{configStore.language === 0 ? '關閉' : 'Close'}}</button>
        </div>
      </footer>
    </div>
  </div>



</template>

<style scoped>

.is-playing {
  color: cornflowerblue;
}
</style>