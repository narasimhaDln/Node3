const express = require("express");
const app = express();
app.use(express.json());
const connection = require('./config/db');
const studentRoutes = require("./routes/student.route");
const dotenv = require("dotenv").config();

app.use("/api", studentRoutes);

app.listen(5060, () => {
  connection();
  console.log("server running at 7080");
});
