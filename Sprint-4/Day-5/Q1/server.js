const express = require("express");

const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("."));
io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("chat", (msg) => {
    io.emit("chat", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
server.listen(4000, () => {
  console.log("server running at 4000 port");
});
