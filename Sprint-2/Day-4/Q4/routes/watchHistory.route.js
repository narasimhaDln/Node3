const HistoryModel = require("../models/watchHistory.model");
const express = require("express");

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const movie = new HistoryModel(req.body);
    await movie.save();

    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: "something went wrong in post history" });
  }
});
module.exports = router;
