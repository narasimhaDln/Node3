const express = require("express");
const AuthMiddleware = require("../middlewares/auth.middleware");
const BookModel = require("../models/book.model");
const checkRole = require("../middlewares/role.middleware");
const bookRouter = express.Router();
bookRouter.post("/bookings", AuthMiddleware, async (req, res) => {
  const { service, dateTime } = req.body;
  try {
    const booking = await BookModel.create({
      userId: req.user.id,
      service,
      dateTime,
    });
    await booking.save();
    res.status(201).json({ message: "booking created", booking });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
bookRouter.get("/bookings", AuthMiddleware, async (req, res) => {
  try {
    const bookings =
      req.role === "admin"
        ? await BookModel.find()
        : await BookModel.find({ userId: req.user.id });
    res.json(bookings);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
bookRouter.put("/bookings/:id", AuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const bookings = await BookModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await bookings.save();
    res.status(200).json({ message: "booking updated", bookings });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
bookRouter.delete("/bookings/:id", AuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const bookings = await BookModel.findByIdAndDelete(id);
    res.status(200).json({ message: "booking is deleted", bookings });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
//admin approve;
bookRouter.patch(
  "/bookings/:id/approve",
  AuthMiddleware,
  checkRole("admin"),
  async (req, res) => {
    try {
      const booking = await BookModel.findByIdAndUpdate(
        req.params.id,
        { status: "approved" },
        { new: true }
      );
      res.json({ message: "booking approved", booking });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "internal server error" });
    }
  }
);
//admin reject:
bookRouter.patch(
  "/bookings/:id/reject",
  AuthMiddleware,
  checkRole("admin"),
  async (req, res) => {
    try {
      const booking = await BookModel.findByIdAndUpdate(
        req.params.id,
        { status: "rejected" },
        { new: true }
      );
      res.json({ message: "booking rejected", booking });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "internal server error" });
    }
  }
);
//admin delete
bookRouter.delete(
  "/bookings/:id/reject",
  AuthMiddleware,
  checkRole("admin"),
  async (req, res) => {
    try {
      const booking = await BookModel.findByIdAndDelete(req.params.id);
      res.json({ message: "booking Deleted", booking });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "internal server error" });
    }
  }
);
module.exports = bookRouter;
