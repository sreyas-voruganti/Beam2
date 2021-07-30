<template>
  <div class="bg-gray-100 rounded p-2 m-2 max-w-sm">
    <p class="text-center font-medium text-lg mb-1">{{ client.name }}</p>
    <video
      autoplay
      muted
      :srcObject.prop="client.stream"
      style="pointer-events: none;"
    ></video>
    <p class="mt-1 text-center">
      <span
        @click="showFullscreenModal = true"
        class="text-blue-700 cursor-pointer font-medium text-lg"
        >View Fullscreen</span
      >
    </p>
    <div class="modal" v-if="showFullscreenModal">
      <div class="p-3 m-3 rounded modal-content">
        <p class="text-center font-medium text-2xl mb-3">
          {{ client.name }}
        </p>
        <video
          autoplay
          muted
          :srcObject.prop="client.stream"
          class="border-4 rounded"
          style="pointer-events: none;"
          ref="video"
        ></video>
        <p class="mt-1 text-xl text-center font-medium">
          <span
            @click="showFullscreenModal = false"
            class="text-blue-700 cursor-pointer"
            >Close Fullscreen</span
          >
          •
          <span @click="pauseVideo" class="text-blue-700 cursor-pointer">{{
            paused ? "Play" : "Pause"
          }}</span>
          •
          <span @click="kickClient" class="text-blue-700 cursor-pointer"
            >Kick</span
          >
        </p>
      </div>
    </div>
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
    showFullscreenModal: false,
  }),
  methods: {
    kickClient() {
      if (confirm("Are you sure you kick this client?")) {
        this.showFullscreenModal = false;
        this.$emit("kickClient", this.client.id);
      }
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

<style lang="postcss" scoped>
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background-color: rgba(0, 0, 0, 0.2);
}
.modal-content {
  @apply max-w-5xl mx-auto bg-white;
}
</style>
