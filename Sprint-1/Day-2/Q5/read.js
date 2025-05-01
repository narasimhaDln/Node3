const fs = require("fs");

function readContent() {
  try {
    const data = fs.readFileSync("./Data.txt", "utf-8");
    return data;
  } catch (error) {
    return "error reading file";
  }
}
module.exports = readContent;
