const cron = require("node-cron");
const fs = require("fs");
cron.schedule("* * * * *", () => {
  const timeStamp = new Date().toISOString();
  const logMessage = `Task running${timeStamp}\n`;

  console.log(logMessage.trim());
  fs.appendFileSync("logs.txt",logMessage);
});
