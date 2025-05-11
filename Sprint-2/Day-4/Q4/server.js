const express = require("express");
const mongoose = require("mongoose");
const connection = require("./config/db");
const dotenv = require("dotenv").config();
const HistoryModel = require("./models/watchHistory.model");
const watchHistoryRoute = require("./routes/watchHistory.route");
const analyticsRoute = require("./routes/analytics.route");
const app = express();
app.use(express.json());

app.post("/watch-history", watchHistoryRoute);

app.get("/analytics", analyticsRoute);
app.listen(5600, () => {
  connection();
  console.log("port running at 5600");
});
