const express = require("express");
const app = express();
app.use(express.json());
const dotenv = require("dotenv").config();
const taskRoutes = require("./routes/task.route");
const connection = require("./config/db");

app.use("/task", taskRoutes);
app.listen("6080", () => {
  connection();
  console.log("server running at 6080");
});
