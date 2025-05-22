const Redis = require("ioredis");
const redis = new Redis();
const cron = require("node-cron");

cron.schedule("*/5 * * * *", async () => {
  try {
    const keys = await redis.keys("deleted:*");
    const now = Date.now();

    for (let key of keys) {
      const event = JSON.parse(await redis.get(key));
      const eventTime = new Date(event.eventDate).getTime();

      if (now > eventTime) {
        await redis.del(key);
        console.log(`Expired soft-deleted event removed: ${key}`);
      }
    }
  } catch (error) {
    console.error("Error in cron job:", error.message);
  }
});
