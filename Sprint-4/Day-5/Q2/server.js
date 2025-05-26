const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(express.static("."));
io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("message", (msg) => {
    io.emit("message", msg);
  });
  socket.on("typing", () => {
    socket.broadcast.emit("typing", "user typing");
  });
  socket.on("stopTyping", () => {
    socket.broadcast.emit("typing", "");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(7080, () => {
  console.log("server running at 7080");
});
