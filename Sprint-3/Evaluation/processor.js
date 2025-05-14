const fs = require("fs");
const path = require("path");
const { randomInt } = require("crypto");
const { log, ensureFolders, moveFile } = require("./utils");
const folders = {
  processing: path.join(__dirname, "Processing"),
  inProgress: path.join(__dirname, "In-Progress"),
  completed: path.join(__dirname, "Completed"),
  crashed: path.join(__dirname, "Crashed"),
};
ensureFolders(Object.values(folders));
function createFile() {
  const now = new Date();
  const timeStamp = `${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}-${now.getMilliseconds()}`;
  //   const timeStamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `file_${timeStamp}.txt`;
  const filePath = path.join(folders.processing, fileName);
  const processingTime = randomInt(1, 7);
  const content = `File Started processing\nProcessing Time:{processingTime}s`;
  fs.writeFileSync(filePath, content);
  log(`File created:${fileName}`);
  setTimeout(() => processFile(filePath, fileName, processingTime), 100);
}

function processFile(filePath, fileName, processingTime) {
  const inProgressPath = path.join(folders.inProgress, fileName);
  fs.appendFileSync(filePath, `\nIn-Progress`);
  moveFile(filePath, inProgressPath);
  log(`In-Progress:${fileName}`);
  const warningTimeout = setTimeout(() => {
    log(`WARNING:${fileName} still in progress after 3s`);
  }, 3000);
  setTimeout(() => {
    clearTimeout(warningTimeout);
    const now = new Date().toISOString();
    if (processingTime < 5) {
      fs.appendFileSync(inProgressPath, `\nFinal-Status:Completed at ${now}`);
      moveFile(inProgressPath, path.join(folders.completed, fileName));
      log(`Completed:${fileName}`);
    } else {
      fs.appendFileSync(inProgressPath, `\nFinal-Status:Crashed at ${now}`);
      moveFile(inProgressPath, path.join(folders.crashed, fileName));
      log(`ERROR:${fileName}crashed after${processingTime}s`);
    }
  }, processingTime * 1000);
}
setInterval(createFile, 3000);
