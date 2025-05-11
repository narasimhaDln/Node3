// eventName: String, required, minimum length of 3 characters
// description: String, optional
// eventDate: Date, required, must be a future date
// location: String, required
// status: Enum, required, with allowed values ["upcoming", "ongoing", "completed"]
// capacity: Number, required, must be greater than 0
// createdAt: Date, default to the current date
// updatedAt: Date, automatically updated on modification
const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  description: { type: String },
  eventDate: { type: Date },
  location: { type: String, required: true },
  status: { type: String, enum: ["upcoming", "ongoing", "completed"] },
  capacity: { type: Number, require: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
});

const EventModel = mongoose.model("event", eventSchema);
module.exports = EventModel;
