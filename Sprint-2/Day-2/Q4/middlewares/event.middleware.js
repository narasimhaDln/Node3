const EventModel = require("../models/event.models");

const validateEventData = (req, res, next) => {
  const { title, description, date } = req.body;

  if (!title || !description || !date) {
    return res.status(400).json({ message: "Incomplete Data Received" });
  }
  next();
};
const checkEventCapacity = async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await EventModel.findById(id);
    if (!event) {
      return res.status(404).json({ message: "event not found" });
    }
    if (event.eventCapacity >= event > maxCapacity) {
      return res.status(400).json({ message: "maxCapacity reached" });
    }
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "server error" });
  }
};
module.exports = { validateEventData, checkEventCapacity };
