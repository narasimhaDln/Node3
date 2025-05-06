const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");
const colors = require("colors");
const loggerMiddleware = require("./middlewares/logger.middleware");
const userRoutes = require("./routes/user.routes");
const systemRoutes = require("./routes/system.routes");
app.use("/user", userRoutes);
app.use("/system", systemRoutes);
app.use(loggerMiddleware);
app.listen(4060, () => {
  console.log(colors.rainbow("server running at 4060"));
});
