const express = require("express");
const mongoose = require("mongoose");

const connection = require("./config/db");
const dotenv = require("dotenv").config();
const app = express();
app.use(express.json());
//schema;
const eventSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date },
});
const EventModel = mongoose.model("event", eventSchema);
app.get("/test", (req, res) => {
  res.send("this is testing route");
});
app.post("/events", async (req, res) => {
  try {
    const event = await EventModel.create(req.body);
    await event.save();
    res.status(201).json({ message: "Event created" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});
app.get("/all-events", async (req, res) => {
  const event = await EventModel.find();
  res.send(event);
});
app.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await EventModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await updatedEvent.save();
    res.status(200).json({ message: "event updated" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});
app.delete("/delete/:id", async (req, res) => {
  try {
    const deleteEvent = await EventModel.findByIdAndDelete(req.params.id);
    if (!deleteEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event Deleted" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});
app.listen(5060, () => {
  connection();
  console.log("server running at 5060");
});
