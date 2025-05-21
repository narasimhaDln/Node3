const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dishId: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
  status: {
    type: String,
    enum: ["Order Received", "Preparing", "Out for Delivery", "Delivered"],
    default: "Order Received",
  },
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const OrderModel = mongoose.model("order", orderSchema);
module.exports = OrderModel;
