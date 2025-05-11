const express = require("express");
const connection = require("./config/db");
const app = express();
app.use(express.json());
const dotenv = require("dotenv").config();
const eventRoutes = require("./routes/event.route");
app.use("/event", eventRoutes);
app.listen(2030, () => {
  connection();
  console.log("server running at 2030");
});
