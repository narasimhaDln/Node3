const express = require("express");
const AuthMiddleware = require("../middlewares/auth.middleware");
const BookingModel = require("../models/booking.model");
const transporter = require("../config/emailer");
const checkRole = require("../middlewares/role.middleware");
const bookingRouter = express.Router();
bookingRouter.use(AuthMiddleware);
bookingRouter.post("/data", async (req, res) => {
  const { destination, date, userId } = req.body;
  try {
    const booking = await BookingModel.create({ destination, date, userId });
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: "narasimha34327@gmail.com",
      subject: "Booking Created",
      text: `Your booking to ${destination} on ${date} is confirmed.`,
    });
    await booking.save();
    res.status(201).json({ message: "booking created", booking });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
bookingRouter.get("/all-bookings", checkRole("admin"), async (req, res) => {
  try {
    const bookings = await BookingModel.find();

    res.status(200).json(bookings);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
bookingRouter.put("/update/:id", checkRole("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await BookingModel.findOne({ _id: id });
    if (!booking) {
      return res.status(401).json({ message: "booking id not found" });
    }
    await BookingModel.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "booking updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
bookingRouter.delete("/delete/:id", checkRole("admin"), async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await BookingModel.findByIdAndDelete(id);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: req.user.email,
      subject: "Booking Deleted",
      text: `Your booking to ${booking.destination} on ${booking.date} has been deleted. Sorry for the inconvenience. We will get back to you soon.`,
    });

    res.status(200).json({
      message: "Booking deleted and email sent",
      deletedBooking: booking,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = bookingRouter;
