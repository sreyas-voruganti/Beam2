<template>
  <div class="container mt-16 max-w-4xl mx-auto">
    <h3 class="text-4xl text-center">
      Beam -
      {{ status == "input" ? "Join a Class" : `You're In ${creds.name}` }}
    </h3>
    <div v-if="status == 'input'" class="mt-5 max-w-xl mx-auto">
      <p
        class="text-center mb-3 text-lg text-blue-700 cursor-pointer"
        v-show="showMacHelp"
        @click="macAlert"
      >
        Nothing happens on MacOs?
      </p>
      <input
        type="text"
        placeholder="Session Code"
        v-model="creds.session_code"
      />
      <input type="text" placeholder="Name" v-model="creds.name" />
      <button
        :disabled="!(creds.name && creds.session_code && peer_id)"
        @click="joinSession"
        class="w-full disabled:opacity-50"
      >
        Join
      </button>
    </div>
    <div v-else class="mt-3">
      <video
        ref="own_video"
        :srcObject.prop="own_stream"
        autoplay
        muted
        width="900px"
        class="border-4 rounded bg-black"
        style="pointer-events: none;"
      ></video>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import Peer from "peerjs";
import socket_url from "@/socket_url";
export default {
  name: "Client",
  data: () => ({
    status: "input",
    socket: null,
    peer: null,
    peer_id: null,
    creds: {
      session_code: null,
      name: null,
    },
    own_stream: null,
    join_clicked: false,
  }),
  created() {
    this.peer = new Peer();
    this.socket = io(socket_url);

    this.socket.on("session_joined", async (host_id) => {
      this.own_stream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: { cursor: "always", frameRate: { max: 14 } },
      });
      this.own_stream.oninactive = () => location.reload();

      if (
        this.own_stream.getVideoTracks()[0].getSettings().displaySurface !==
        "monitor"
      ) {
        this.own_stream.getVideoTracks()[0].stop();
        return alert("Only Entire Screen sharing is allowed");
      }

      setTimeout(() => {
        this.peer.call(host_id, this.own_stream, {
          metadata: { name: this.creds.name },
        });
        this.status = "joined";
      }, 1000);
    });

    this.socket.on("host_left", () => location.reload());

    this.socket.on("session_not_found", () => alert("Invalid session code"));

    this.socket.on("client_kicked", (client_id) => {
      if (this.peer_id == client_id) location.reload();
    });

    this.peer.on("open", (id) => (this.peer_id = id));
  },
  computed: {
    showMacHelp() {
      return this.join_clicked && navigator.platform == "MacIntel";
    },
  },
  methods: {
    async joinSession() {
      this.join_clicked = true;
      this.socket.emit("join_session", {
        id: this.creds.session_code,
        name: this.name,
        peer_id: this.peer_id,
      });
    },
    macAlert() {
      alert(
        "Go to System Preferences > Security & Privacy > Screen Recording > Check off your browser > Reload and try again."
      );
    },
  },
};
</script>

<style lang="postcss" scoped>
input {
  @apply p-2.5 rounded focus:outline-none bg-gray-100 m-2 w-full;
}
button {
  @apply bg-red-700 p-2.5 mt-3 ml-2 rounded text-white text-lg;
}
</style>
