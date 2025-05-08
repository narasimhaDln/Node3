const express = require("express");
const connection = require("./config/db");
const libriaryRoutes = require("./routes/library.routes");
const dotenv = require("dotenv").config();
const app = express();
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("this is testing route");
});
app.use("/api", libriaryRoutes);

app.listen(8000, () => {
  connection();
  console.log("server running at 8000");
});
