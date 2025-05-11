const express = require("express");
const HistoryModel = require("../models/watchHistory.model");
const router = express.Router();
router.get("/analytics/top-movies", async (req, res) => {
  try {
    const movies = await HistoryModel.aggregate([
      { $group: { _id: "$title", totalWatchTime: { $sum: "$watchTime" } } },
      { $sort: { totalWatchTime: -1 } },
      { $limit: 5 },
    ]);
    if (!movies) {
      return res.status(200).json({ message: "Data Not FOund In top movies" });
    }
    res.json(movies);
  } catch (error) {
    res.status(400).json({ message: "something went wrong in post history" });
  }
});
router.get("/analytics/genre-popularity", async (req, res) => {
  try {
    const genres = await HistoryModel.aggregate([
      { $group: { _id: "$genre", totalWatchTime: { $sum: "$watchTime" } } },
    ]);
    if (!genres) {
      return res
        .status(200)
        .json({ message: "Data not found genre popularity " });
    }
    res.json(genres);
  } catch (error) {
    res.status(400).json({ message: "something went wrong in post history" });
  }
});
router.get("/analytics/user-engagement", async (req, res) => {
  try {
    const engagement = await HistoryModel.aggregate([
      { $group: { _id: "$userId", totalWatchTime: { $sum: "$watchTime" } } },
      { $group: { _id: null, avgWatchTime: { $avg: "$totalWatchTime" } } },
    ]);
    if (!engagement) {
      return res.status(200).json({ message: "Data not found in engagement" });
    }
    res.json(engagement);
  } catch (error) {
    res
      .status(400)
      .json({ message: "something went wrong in post engagement" });
  }
});
router.get("/analytics/subscription-watchtime", async (req, res) => {
  try {
    const subscription = await HistoryModel.aggregate([
      {
        $group: {
          _id: "$subscriptionType",
          totalWatchTime: { $sum: "$totalWatchTime" },
        },
      },
    ]);
    if (!subscription) {
      return res.status(200).json({ message: "Invalid subscriptionData" });
    }
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ message: "something went wrong in subscription" });
  }
});
router.get("/analytics/highest-rated-movies", async (req, res) => {
  try {
    const ratedMovies = await HistoryModel.aggregate([
      { $group: { _id: "$title", avgRating: { $avg: "$rating" } } },
      { $sort: { avgRating: -1 } },
      { $limit: 3 },
    ]);
    if (!ratedMovies) {
      return res.status(200).json({ message: "Invalid ratedMovies Data" });
    }
    res.json(ratedMovies);
  } catch (error) {
    res.status(400).json({ message: "something went wrong in subscription" });
  }
});
module.exports = router;
