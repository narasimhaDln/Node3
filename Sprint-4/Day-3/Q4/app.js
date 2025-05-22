const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const connection = require("./config/db");
const eventRouter = require("./routes/event.route");
const UserRouter = require("./routes/user.route");

app.use("/user", UserRouter);
app.use("/event", eventRouter);
require("./utils/cron");
app.listen(8080, () => {
  connection();
  console.log("server running at 8080");
});
