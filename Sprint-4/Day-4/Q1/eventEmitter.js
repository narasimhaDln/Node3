const EventEmitter = require("node:events");

const eventEmitter = new EventEmitter();
eventEmitter.on("greet", () => {
  console.log("Hello! Welcome to Event-Driven Programming in Node.js");
});
eventEmitter.emit("greet");
