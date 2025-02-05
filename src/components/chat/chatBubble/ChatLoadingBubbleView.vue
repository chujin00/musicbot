<script setup>


</script>

<template>
  <div :class="['chat-message-bubble-canvas', 'chat-message-bubble-canvas-left']" >
    <span style="line-height: 20px; color: gray"><div class="button is-loading is-small is-ghost" style="margin-top: 6px"></div></span>
  </div>
</template>

<style scoped>
.chat-message-bubble-canvas {
  background: #E4E4E7;
  max-width: 80%;
  padding: 10px;
  border-radius: 10px;
}

.chat-message-bubble-canvas-left {
  float: left;
}

</style>