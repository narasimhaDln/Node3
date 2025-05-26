const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const users = {};
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on("joinRoom", ({ userName, room }) => {
    socket.join(room);
    users[socket.id] = { userName, room };
    socket.to(room).emit(`userNotification`, `${userName} has joined the room`);
    socket.emit(`message`, `welcome to ${room},${userName}`);
  });
  //private messages
  socket.on("privateMessage", ({ recipientId, message }) => {
    if (users[recipientId]) {
      io.to(recipientId).emit("privateMessage", {
        from: socket.id,
        message,
      });
    }
  });
  socket.on("message", (msg) => {
    const user = users[socket.id];
    if (user && user.room) {
      io.to(user.room).emit(`message`, `${user.userName}:${msg}`);
    }
  });
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user && user.room) {
      io.to(user.room).emit(
        `userNotification`,
        `${user.userName} has left the room`
      );
      delete users[socket.id];
    }
    console.log("user disconnected", socket.id);
  });
});
server.listen(5000, () => {
  console.log("server running on 5000");
});
