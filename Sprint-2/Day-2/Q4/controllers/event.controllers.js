const EventModel = require("../models/event.models");

const createEvent = async (req, res) => {
  try {
    const event = await EventModel.create(req.body);
    await event.save();
    res.status(201).json({ message: "event created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const getEvents = async (req, res) => {
  const event = await EventModel.find();
  res.send(event);
};
const updateEventDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found" });

    res.status(200).json({ message: "Event Updated", event: updatedEvent });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error updating event" });
  }
};
const updateEventCapacity = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventCapacity } = req.body;
    const event = await EventModel.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error updating event" });
  }
  if (eventCapacity > event.maxCapacity) {
    return res.status(400).json({ message: "maxCapacity reached" });
  }
  event.eventCapacity = eventCapacity;
  await event.save();

  res.status(200).json({ message: "Event Capacity Updated", event });
};
const deleteEvent = async (req, res) => {
  try {
    const deleteEvent = await EventModel.findByIdAndDelete(req.params.id);
    if (!deleteEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "event deleted " });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error updating event" });
  }
};
module.exports = {
  createEvent,
  getEvents,
  updateEventDetails,
  deleteEvent,
  updateEventCapacity,
};
