const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const {
  addEvent,

  updateEvent,
  deleteEvent,
  getPaginationEvents,
  lowCapacityEvent,
} = require("../controllers/event.controllers");
router.post("/data", addEvent);
router.put("/update/:id", updateEvent);
router.delete("/delete/:id", deleteEvent);
router.get("/paginated", getPaginationEvents);
router.get("/low", lowCapacityEvent);
module.exports = router;
