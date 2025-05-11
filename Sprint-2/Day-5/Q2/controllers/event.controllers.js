const EventModel = require("../models/event.model");

const addEvent = async (req, res) => {
  try {
    const event = await EventModel.create(req.body);
    await event.save();
    res.status(201).json({ message: "event created", event });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const updateEvent = async (req, res) => {
  const id = req.params.id;
  try {
    const updateEvent = await EventModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await updateEvent.save();
    res.status(200).json({ message: "event updated", updateEvent });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteEvent = await EventModel.findByIdAndDelete(id);
    res.status(200).json({ message: "event deleted", deleteEvent });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const lowCapacityEvent = async (req, res) => {
  try {
    const events = await EventModel.find({ capacity: { $lt: 30 } });
    res.status(200).json(events);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const getPaginationEvents = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const skip = Number(req.query.skip) || 0;
    const event = await EventModel.find().limit(limit).skip(skip);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
module.exports = {
  getPaginationEvents,
  lowCapacityEvent,
  addEvent,
  updateEvent,
  deleteEvent,
};
