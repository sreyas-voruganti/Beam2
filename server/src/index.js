require("dotenv").config();
const http = require("http");
const server = http.createServer();
const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

const session_hosts = {};

io.on("connection", (socket) => {
  socket.on("start_session", (peer_id) => {
    const sessionId = uuidv4().substring(0, 6);
    socket.u_type = "host";
    socket.session_id = sessionId;
    socket.peer_id = peer_id;
    socket.emit("session_started", sessionId);
    socket.join(sessionId);
    session_hosts[sessionId] = peer_id;
  });

  socket.on("disconnect", () => {
    if (socket.u_type == "host" && session_hosts[socket.session_id]) {
      delete session_hosts[socket.session_id];
      socket.to(socket.session_id).emit("host_left");
    } else {
      socket.to(socket.session_id).emit("client_left", socket.peer_id);
    }
  });

  socket.on("kick_client", (client_id) => {
    socket.to(socket.session_id).emit("client_kicked", client_id);
  });

  // Client Actions
  socket.on("join_session", (client) => {
    if (!(client.id in session_hosts)) {
      socket.emit("session_not_found");
      return;
    }

    socket.u_type = "client";
    socket.u_name = client.name;
    socket.session_id = client.id;
    socket.peer_id = client.peer_id;
    socket.join(client.id);
    socket.emit("session_joined", session_hosts[client.id]);
  });
});

server.listen(parseInt(process.env.PORT), () =>
  console.log(`Server started on port ${process.env.PORT}`)
);
