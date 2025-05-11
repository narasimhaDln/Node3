const express = require("express");
const app = express();
app.use(express.json());
const libraryRoutes = require("./routes/library.route");
const connection = require("./config/db");
app.use("/library", libraryRoutes);
app.listen(4060, () => {
  connection();
  console.log("server running at 4060");
});
