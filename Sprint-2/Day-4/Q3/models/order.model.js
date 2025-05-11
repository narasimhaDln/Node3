const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  username: { type: String },
  productName: { type: String },
  category: { type: String },
  quantity: { type: Number },
  totalPrice: { type: Number },
  orderDate: { type: Date },
  status: {
    type: String,
    enum: ["pending", "shipped", "Delivered", "Cancelled"],
  },
});
const OrderModel = mongoose.model("order", orderSchema);
module.exports = OrderModel;
