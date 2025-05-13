const express = require("express");
const mongoose = require("mongoose");
const connection = require("./config/db");
require("dotenv").config();
const AttendanceModel = require("./models/attendance.model");
const app = express();
app.use(express.json());

app.post("/attendance", async (req, res) => {
  try {
    const data = await AttendanceModel.create(req.body);
    await data.save();
    res.status(201).json({ message: "Attendance is posted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/analytics/total-attendance", async (req, res) => {
  try {
    const result = await AttendanceModel.aggregate([
      { $group: { _id: "$employeeId", AttendanceCount: { $sum: 1 } } },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Something wrong in total attendance" });
  }
});
app.get("/analytics/attendance-history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Not valid" });
    }
    let history = await AttendanceModel.find({ employeeId: id });
    if (!history.length) {
      return res.status(400).json({ message: "Not valid" });
    }
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Something wrong in history" });
  }
});
app.get("/analytics/top-attendees", async (req, res) => {
  try {
    const result = await AttendanceModel.aggregate([
      { $match: { status: "Present" } },
      { $group: { _id: "$employeeId", AttendanceCount: { $sum: 1 } } },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $match: { AttendanceCount: { $gte: 20 } } },
    ]);
    if (!result.length) {
      return res.status(400).json({ message: "Not valid Data" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something wrong in history" });
  }
});
app.get("/analytics/absent-employees", async (req, res) => {
  try {
    const result = await AttendanceModel.aggregate([
      { $match: { status: "Absent" } },
      { $group: { _id: "$employeeId", absentCount: { $sum: 1 } } },
      { $match: { absentCount: { $gt: 5 } } },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
    ]);
    if (!result.length)
      return res.status(400).json({ message: "No data found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something wrong in absent employees" });
  }
});
app.get("/recent-attendance", async (req, res) => {
  try {
    const result = await AttendanceModel.find().sort({ date: -1 }).limit(5);

    if (!result.length)
      return res.status(400).json({ message: "No data found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});
app.listen(9090, () => {
  connection();
  console.log("server running at 9090");
});
