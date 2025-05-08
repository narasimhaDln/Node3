const express = require("express");
const app = express();
app.use(express.json());
const taskROutes = require("./routes/task.routes");
const dotenv = require("dotenv").config();
const connection = require("./config/db");

app.use("/task", taskROutes);
app.listen(6080, () => {
  connection();
  console.log("server running at 6080");
});
