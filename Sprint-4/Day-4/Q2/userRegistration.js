const EventEmitter = require("node:events");
const eventEmitter = new EventEmitter();
eventEmitter.on("userRegister", (username, email) => {
  console.log(`User ${username} successful register with this ${email}`);
  setTimeout(() => {
    console.log("Registration conformed", email);
  }, 2000);
});
eventEmitter.on("sendConfirmation", (email) => {
  console.log(`Confirmation mail sent ${email}`);
});
eventEmitter.emit("greet", "Harsha", "harsha123@gmail.com");
eventEmitter.emit("sendConfirmation", "harsha123@gmail.com");
