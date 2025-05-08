const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
  title: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  maxCapacity: { type: Number, default: 300 },
  eventCapacity: { type: Number, default: 0 },
  isFull: { type: Boolean, default: false },
});
const EventModel = mongoose.model("event", eventSchema);
module.exports = EventModel;
