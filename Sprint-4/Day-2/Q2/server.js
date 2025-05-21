const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const connection = require("./config/db");
const UserRoutes = require("./routes/user.route");
const BookingRoute = require("./routes/booking.route");
app.use("/user", UserRoutes);
app.use("/book", BookingRoute);
app.listen(7090, () => {
  connection();
  console.log("server running at 7090");
});
