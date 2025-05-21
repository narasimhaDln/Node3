const OrderModel = require("../models/order.model");
const UserModel = require("../models/user.model");
const transporter = require("../config/emailer");
const express = require("express");
const AuthMiddleware = require("../middlewares/auth.midddleware");
const orderRouter = express.Router();
orderRouter.use(AuthMiddleware);
orderRouter.post("/createOrder", async (req, res) => {
  try {
    const chefs = await UserModel.find({ role: "chef" });
    const randomChef = chefs[Math.floor(Math.random() * chefs.length)];

    const order = await OrderModel.create({
      ...req.body,
      userId: req.user.id,
      chefId: randomChef._id,
      status: "Order Received",
    });

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

orderRouter.get("/getUserOrders", async (req, res) => {
  try {
    const orders = await OrderModel.find({ userId: req.user.id }).populate(
      "dishId chefId"
    );
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

orderRouter.put("/update/:id", async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status;
    await order.save();

    if (order.status === "Delivered") {
      const user = await User.findById(order.userId);
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Order Delivered",
        text: `Your dish has been delivered!\n\nOrder: ${order._id}\nStatus: ${order.status}`,
      });
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = orderRouter;
