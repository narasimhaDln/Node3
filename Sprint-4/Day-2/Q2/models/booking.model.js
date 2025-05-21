const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  destination: String,
  date: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});
const BookingModel = mongoose.model("booking", bookingSchema);
module.exports = BookingModel;
