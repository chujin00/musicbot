<template>
  <div class="youtube-player">
    <iframe
      :src="videoUrl"
      width="100%"
      height="315"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
  computed: {
    videoUrl() {
      return `https://www.youtube.com/embed/${this.videoId}`;
    },
  },
};
</script>

<style scoped>
.youtube-player {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>