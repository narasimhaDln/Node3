const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const userRoutes = require("./routes/user.route");
const connection = require("./config/db");
app.use("/users", userRoutes);
app.listen(3000, () => {
  connection();
  console.log("server running 3000");
});
