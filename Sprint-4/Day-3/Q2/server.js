const Redis = require("ioredis");
const redis = new Redis();
//setting the key to redis
// redis.set("name", "John");
// redis.get("name", (err, result) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(result);
//   }
// });
 redis.del("name", (delErr, delCount) => {
    if (delErr) {
      console.log("Error  deleting key", delErr);
    } else {
      console.log(`key deleted:${delCount},key(s)`);
    }
  });
