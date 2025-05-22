const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  eventDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});
const EventModel = mongoose.model("event", eventSchema);
module.exports = EventModel;
