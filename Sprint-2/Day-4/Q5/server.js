const express = require("express");
const mongoose = require("mongoose");
const connection = require("./config/db");
const WorkOutModel = require("./models/workOut.model");
const app = express();
app.use(express.json());

app.post("/workouts", async (req, res) => {
  try {
    const postData = await WorkOutModel(req.body);
    console.log(postData);
    await postData.save();
    res.status(201).json(postData);
  } catch (error) {
    res.status(400).json({ message: "something went wrong workouts" });
  }
});

app.get("/analytics/top-workouts", async (req, res) => {
  try {
    const topWorkOuts = await WorkOutModel.aggregate([
      { $group: { _id: "$workoutType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);
    if (!topWorkOuts) {
      return res.status(200).json({ message: "Invalid Data in top workouts" });
    }
    res.json(topWorkOuts);
  } catch (error) {
    res.status(400).json({ message: "something went wrong top workouts" });
  }
});

app.get("/analytics/average-calories", async (req, res) => {
  try {
    const averageCalories = await WorkOutModel.aggregate([
      {
        $group: {
          _id: "$workoutType",
          averageCalories: { $avg: "$caloriesBurned" },
        },
      },
    ]);
    if (!averageCalories) {
      return res
        .status(200)
        .json({ message: "Invalid Data in average Calories" });
    }
    res.json(averageCalories);
  } catch (error) {
    res.status(400).json({ message: "something went wrong average calories" });
  }
});
app.get("/analytics/intensity-distribution", async (req, res) => {
  try {
    const distribution = await WorkOutModel.aggregate([
      { $group: { _id: "$intensity", count: { $sum: 1 } } },
    ]);
    if (!distribution) {
      return res.status(200).json({ message: "Invalid Data in distribution" });
    }
    res.json(distribution);
  } catch (error) {
    res.status(400).json({ message: "something went wrong average calories" });
  }
});
app.get("/analytics/weekly-activity", async (req, res) => {
  try {
    const weeklyActivity = await WorkOutModel.aggregate([
      { $group: { _id: { $week: "$date" }, totalWorkOuts: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);
    if (!weeklyActivity) {
      return res
        .status(200)
        .json({ message: "InvalidData in weekly activity" });
    }
    res.json(weeklyActivity);
  } catch (error) {
    res.status(400).json({ message: "something went wrong weeklyActivity" });
  }
});
app.get("/analytics/top-performing-users", async (req, res) => {
  try {
    const topPerformingUsers = await WorkOutModel.aggregate([
      { $group: { _id: "$username", totalTime: { $sum: "$duration" } } },
      { $sort: { totalTime: -1 } },
      { $limit: 5 },
    ]);
    if (!topPerformingUsers) {
      return res
        .status(200)
        .json({ message: "InvalidData in top performing users" });
    }
    res.json(topPerformingUsers);
  } catch (error) {
    res.status(400).json({ message: "something went wrong weeklyActivity" });
  }
});
app.listen(4300, () => {
  connection();
  console.log("port running at 4300");
});
