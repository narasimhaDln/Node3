const fs = require("fs");
const path = require("path");
const logFile = path.join(__dirname, "logs.txt");
function log(message) {
  const time = new Date().toISOString();
  const logEntry = `[${time}]${message}\n`;
  fs.appendFileSync(logFile, logEntry);
  console.log(logEntry.trim());
}
function ensureFolders(folders) {
  folders.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  });
}
function moveFile(oldPath, newPath) {
  fs.renameSync(oldPath, newPath);
}
module.exports = { log, ensureFolders, moveFile };
