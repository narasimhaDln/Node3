const express = require("express");
const app = express();
app.use(express.json());
const memberRoutes = require("./routes/member.route");
const bookRoutes = require("./routes/book.routes");
const connection = require("./config/db");
const dotenv = require("dotenv").config();
app.use("/member", memberRoutes);
app.use("/book", bookRoutes);
app.listen(9090, () => {
  connection();
  console.log("server running at 9090");
});
