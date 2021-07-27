<template>
  <div>
    <p class="text-center">
      {{ status == "started" ? session_code : "Loading Session Code" }}
    </p>
    <p
      class="text-center cursor-pointer"
      @click="showLog = !showLog"
      v-show="messageLog.length > 0"
    >
      {{ showLog ? "Hide" : "Show" }} Log
    </p>
    <div class="bg-gray-100 rounded m-2 p-2.5 w-2/5 mx-auto" v-show="showLog">
      <input
        class="mb-1 w-full rounded px-2 py-1 bg-gray-200 focus:outline-none"
        placeholder="search log"
        v-model="logSearch"
        v-show="messageLog.length > 1"
      />
      <ul class="overflow-y-scroll max-h-52">
        <li
          v-for="(message, index) in messageLog.filter((m) =>
            m.msg.toLowerCase().includes(logSearch.toLowerCase())
          )"
          :key="index"
        >
          {{ formatDate(message.ts) }}: {{ message.msg }}
        </li>
      </ul>
    </div>
    <input
      class="w-1/2 m-3 rounded p-2 bg-gray-100 focus:outline-none"
      placeholder="search clients"
      v-model="clientSearch"
      v-show="clients.length > 1"
    />
    <div class="grid" style="grid-template-columns: repeat(auto-fill, 24rem)">
      <ClientVideo
        v-for="client in clients.filter((c) =>
          c.name.toLowerCase().includes(clientSearch.toLowerCase())
        )"
        :key="client.id"
        :client="client"
        @kickClient="kickClient"
      />
      <p
        v-show="
          clients.filter((c) =>
            c.name.toLowerCase().includes(clientSearch.toLowerCase())
          ).length < 1 && clients.length > 0
        "
      >
        No Clients Found
      </p>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import Peer from "peerjs";
import ClientVideo from "@/components/ClientVideo.vue";
import { format } from "date-fns";
import socket_url from "@/socket_url";
export default {
  name: "Host",
  components: { ClientVideo },
  data: () => ({
    status: "loading_code",
    session_code: null,
    socket: null,
    peer: null,
    clients: [],
    messageLog: [],
    logSearch: "",
    showLog: false,
    clientSearch: "",
  }),
  methods: {
    logMessage(msg) {
      this.messageLog.unshift({
        msg,
        ts: Date.now(),
      });
    },
    formatDate(d) {
      return format(new Date(d), "hh:mm:ss a");
    },
    kickClient(client_id) {
      let clientName = "";
      this.clients.forEach((client) => {
        if (client.id === client_id) clientName = client.name;
      });
      this.clients = this.clients.filter((client) => client.id !== client_id);
      this.logMessage(`${clientName} left (kicked)`);
      this.socket.emit("kick_client", client_id);
    },
  },
  created() {
    this.peer = new Peer();
    this.socket = io(socket_url);

    this.peer.on("open", (peer_id) => {
      this.socket.emit("start_session", peer_id);
    });

    this.peer.on("call", (call) => {
      call.answer();
      call.on("stream", (clientStream) => {
        this.clients.push({
          id: call.peer,
          stream: clientStream,
          name: call.metadata.name,
        });
        this.logMessage(`${call.metadata.name} joined`);
      });
    });

    this.socket.on("session_started", (session_code) => {
      this.status = "started";
      this.session_code = session_code;
    });

    this.socket.on("client_left", (client_id) => {
      let clientName = "";
      this.clients.forEach((client) => {
        if (client.id === client_id) clientName = client.name;
      });

      if (clientName) {
        this.clients = this.clients.filter((client) => client.id !== client_id);
        this.logMessage(`${clientName} left`);
      }
    });
  },
};
</script>
