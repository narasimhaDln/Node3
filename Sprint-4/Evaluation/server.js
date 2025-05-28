require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const connection = require("./config/db");
const UserRoutes = require("./routes/user.route");
const JobRoutes = require("./routes/job.route");
const jobRouter = require("./routes/job.route");
app.use("/user", UserRoutes);
app.use("/job", jobRouter);
app.listen(8090, () => {
  connection();
  console.log("server running 8090");
});
