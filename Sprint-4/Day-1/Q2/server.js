const express = require("express");
const connection = require("./config/db");
require("dotenv").config();
const app = express();
app.use(express.json());
const BookingRoutes = require("./routes/bookingRoute");
const UserRoutes = require("./routes/user.route");
app.use("/user", UserRoutes);
app.use("/book", BookingRoutes);
app.listen(8090, () => {
  connection();
  console.log("server running 8090");
});
