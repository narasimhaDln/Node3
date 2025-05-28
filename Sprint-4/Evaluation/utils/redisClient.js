const Redis = require("ioredis");
const client = new Redis(process.env.REDIS_URL);
client.on("connect", () => {
  console.log("Redis connected via ioredis");
});
client.on("error", (err) => {
  console.log("Redis connection error", err);
});
module.exports = client;
