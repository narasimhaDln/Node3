const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
require("./jobs/pendingLogger");
const connection = require("./config/db");
const TodoRouter = require("./routes/todo.route");
const UserRouter = require("./routes/user.route");
app.use("/todo", TodoRouter);
app.use("/user", UserRouter);

app.listen(8080, () => {
  connection();
  console.log("server running at 8080");
});
