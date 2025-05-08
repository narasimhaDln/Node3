const express = require("express");
const {
  validateEventData,
  checkEventCapacity,
} = require("../middlewares/event.middleware");
const {
  createEvent,
  getEvents,
  updateEventDetails,
  deleteEvent,
  updateEventCapacity,
} = require("../controllers/event.controllers");

const router = express.Router();
router.post("/event", validateEventData, createEvent);
router.get("/events", getEvents);
router.patch("/event/:id", updateEventDetails);
router.patch("/events/update/:id", checkEventCapacity, updateEventCapacity);
router.delete("/events/:id", deleteEvent);
module.exports = router;
