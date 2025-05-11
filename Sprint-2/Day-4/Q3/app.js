const express = require("express");
const OrderModel = require("./models/order.model");
const connection = require("./config/db");
const dotenv = require("dotenv").config();
const app = express();
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("This is testing route");
});

app.post("/order", async (req, res) => {
  try {
    const order = await OrderModel.create(req.body);
    await order.save();
    res.status(201).json({ message: "order is created" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/orders", async (req, res) => {
  const orders = await OrderModel.find();
  res.send(orders);
});
app.get("/analytics/top-products", async (req, res) => {
  try {
    const topProducts = await OrderModel.aggregate([
      { $group: { _id: "$productName", totalSold: { $sum: "$quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 3 },
    ]);
    if (!topProducts) {
      return res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    res.status(400).json({ message: "something wrong in top-products" });
  }
});
app.get("/analytics/revenue-by-category", async (req, res) => {
  try {
    const revenueByCategory = await OrderModel.aggregate([
      { $group: { _id: "$category", totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    if (!revenueByCategory) {
      return res.status(200).json({ message: "No revenue data found" });
    }
    res.json(revenueByCategory);
  } catch (error) {
    res.status(400).json({ message: "something went wrong in post orders" });
  }
});
app.get("/analytics/average-order-value", async (req, res) => {
  try {
    const orderPerMonth = await OrderModel.aggregate([
      {
        $group: {
          _id: "$productName",
          averageOrderValue: { $avg: "$totalPrice" },
        },
      },
    ]);
    if (!orderPerMonth) {
      return res.status(200).json({ message: "No data perMonth" });
    }
    res.json(orderPerMonth);
  } catch (error) {
    res.status(400).json({ message: "something went wrong in per month" });
  }
});
app.get("/analytics/orders-per-month", async (req, res) => {
  try {
    const orderPerMonth = await OrderModel.aggregate([
      { $group: { _id: { $month: "$orderDate" }, orderCount: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    if (!orderPerMonth) {
      return res.status(200).json({ message: "No data perMonth" });
    }
    res.json(orderPerMonth);
  } catch (error) {
    res.status(400).json({ message: "something went wrong in per month" });
  }
});
app.get("/analytics/cancellation-rate", async (req, res) => {
  try {
    const res = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          canceledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          cancellationRate: {
            $multiply: [{ $divide: ["$canceledOrders", "$totalOrders"] }, 100],
          },
        },
      },
    ]);
    res.json(result[0]);
  } catch (error) {
    res.status(400).json({ message: "something went wrong in per month" });
  }
});
app.listen(5060, () => {
  connection();
  console.log("Server running at 5060");
});
