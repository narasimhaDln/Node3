const WebSocket = require("ws");
const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8080 });
console.log("web server running ws//localhost:8080");
wss.on("connection", (ws) => {
  console.log("new client connected");
  ws.on("message", (message) => {
    console.log(`received:${message}`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("client disconnected");
  });
});
