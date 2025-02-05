<script setup>
import {onMounted} from "vue";
import {useConfigStore} from "@/stores/useConfigStore.js";

const configStore = useConfigStore();

onMounted(async () => {
  configStore.tag = 'end';
})
</script>

<template>
  <div class="chat-canvas container is-max-desktop">
    <section class="hero is-fullheight-with-navbar">
      <div class="hero-body">
        <div class="context">
          <p class="title">感謝您的參與，實驗已結束！</p>
          <p class="title">Thank you for your participation, the experiment is over!</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>