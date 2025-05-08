const express = require("express");
const connection = require("./config/db");
const dotenv = require("dotenv").config();
const eventRoutes = require("./routes/event.routes");
const app = express();
app.use(express.json());

app.use("/api", eventRoutes);

app.listen(6000, () => {
  connection();
  console.log("server running at 6000");
});
