const fs = require("fs");
const loggerMiddleware = (req, res, next) => {
  const log = `${new Date().toDateString()}-${req.method} ${req.url}\n`;
  fs.appendFileSync("logs.txt", log);
  next();
};

module.exports = loggerMiddleware;
