const express = require("express");
const EventModel = require("../models/event.model");
const AuthMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/role.middleware");
const eventRouter = express.Router();
const Redis = require("ioredis");
const redis = new Redis();
eventRouter.use(AuthMiddleware);
eventRouter.post("/data", checkRole("admin"), async (req, res) => {
  const { title, description, eventDate } = req.body;
  try {
    const event = await EventModel.create({
      title,
      description,
      eventDate,
      createdBy: req.userId,
    });
    await redis.del("events");
    res.status(201).json({ message: "event created", event });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
eventRouter.get("/get-allEvent", checkRole("admin"), async (req, res) => {
  try {
    const cache = await redis.get("events");
    if (cache) {
      return res.status(200).json(JSON.parse(cache));
    }
    let events;
    if (req.role === "admin") {
      events = await EventModel.find();
    } else {
      events = await EventModel.find({ createdBy: req.userId });
    }
    await redis.get("events", JSON.stringify(events), "EX", 300);

    res.status(200).json(events);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
eventRouter.put("/update/:id", checkRole("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const event = await EventModel.findById(id);
    if (!event) return res.status(404).json({ message: "event not found" });
    if (req.role !== "admin" && req.userId !== event.createdBy.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const update = await EventModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await redis.del("events");

    res.status(200).json({ message: "event updated", update });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
eventRouter.delete("delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const event = await EventModel.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (req.role !== "admin" && req.userId !== event.createdBy.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const eventTime = new Date(event.eventDate).getTime();
    const now = new Date().getTime();
    const diffHours = (eventTime - now) / (1000 * 60 * 60);

    if (diffHours <= 24) {
      await redis.set(
        `deleted:${event._id}`,
        JSON.stringify(event),
        "EX",
        86400
      );
      await EventModel.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ message: "Event soft-deleted (cached)", event });
    }

    await EventModel.findByIdAndDelete(id);
    await redis.del("events");
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = eventRouter;
