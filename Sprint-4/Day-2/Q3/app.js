const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const connection = require("./config/db");
const UserRouter = require("./routes/user.route");
const OrderRouter = require("./routes/order.route");
const DishRouter = require("./routes/dish.route");
app.use("/user", UserRouter);
app.use("/order", OrderRouter);
app.use("/dish", DishRouter);
app.listen(5060, () => {
  connection();
  console.log("server running 5060");
});
