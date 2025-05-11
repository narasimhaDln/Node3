const express = require("express");
const mongoose = require("mongoose");
const connection = require("./config/db");
const StudentModel = require("./models/student.model");
const CourseModel = require("./models/course.model");
const dotenv = require("dotenv").config();
const app = express();
app.use(express.json());

app.post("/add-student", async (req, res) => {
  try {
    const student = new StudentModel(req.body);
    console.log(student);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: "something error in add student route" });
  }
});
app.post("/add-course", async (req, res) => {
  try {
    const course = new CourseModel(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: "something error in course route" });
  }
});
app.post("/enroll", async (req, res) => {
  const { studentId, courseId } = req.body;
  try {
    await StudentModel.findByIdAndUpdate(studentId, {
      $push: { enrolledCourses: courseId },
    });
    await CourseModel.findByIdAndUpdate(courseId, {
      $push: { enrolledStudents: studentId },
    });
    res.json({ message: "Enrollment successful" });
  } catch (error) {
    res.status(500).json({ message: "Enrollment failed" });
  }
});
app.get("/student/:id", async (req, res) => {
  const student = await StudentModel.findById(req.params.id).populate(
    "enrolledCourses",
    "name description"
  );
  res.json(student);
});
app.get("/course/:id", async (req, res) => {
  const course = await CourseModel.findById(req.params.id).populate(
    "enrolledStudents",
    "name email"
  );
  res.json(course);
});
app.listen(2000, () => {
  connection();
  console.log("server running at port 2000");
});
