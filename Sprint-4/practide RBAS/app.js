require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());

const connection = require("./config/db");
const UserRouter = require("./routes/auth.route");
const TodoRouter = require("./routes/todo.route");
app.use("/auth", UserRouter);
app.use("/todo", TodoRouter);
app.listen("4050", () => {
  connection();
  console.log("server running 4050");
});
