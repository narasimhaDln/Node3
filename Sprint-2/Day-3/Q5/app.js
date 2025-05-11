const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.route");
const bookRoutes = require("./routes/book.route");
const connection = require("./config/db");
const dotenv = require("dotenv").config();
const app = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/books", bookRoutes);

app.listen(4600, () => {
  connection();
  console.log("server running at 4600 ");
});
