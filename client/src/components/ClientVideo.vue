<template>
  <div class="bg-gray-100 rounded p-2 m-2 max-w-sm">
    <p class="text-center font-medium text-lg mb-1">{{ client.name }}</p>
    <video
      autoplay
      muted
      :srcObject.prop="client.stream"
      ref="video"
      style="pointer-events: none;"
    ></video>
    <p class="mt-1 text-center">
      <span @click="openFullscreen" class="text-blue-700 cursor-pointer"
        >View Fullscreen</span
      >
      -
      <span @click="kickClient" class="text-blue-700 cursor-pointer">Kick</span>
      -
      <span @click="pauseVideo" class="text-blue-700 cursor-pointer">{{
        paused ? "Play" : "Pause"
      }}</span>
    </p>
  </div>
</template>

<script>
export default {
  name: "ClientVideo",
  props: {
    client: Object,
  },
  data: () => ({
    paused: false,
  }),
  methods: {
    openFullscreen() {
      this.$refs.video.requestFullscreen();
    },
    kickClient() {
      this.$emit("kickClient", this.client.id);
    },
    pauseVideo() {
      if (this.paused) {
        this.$refs.video.play();
        this.paused = false;
      } else {
        this.$refs.video.pause();
        this.paused = true;
      }
    },
  },
};
</script>
