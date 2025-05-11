const express = require("express");
const CourseModel = require("../models/course.model");

const addCourse = async (req, res) => {
  try {
    const course = await CourseModel.create(req.body);
    await course.save();
    res.status(201).json({ message: "course is created" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const getCourseById = async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.courseId).populate(
      "enrolledStudents"
    );
    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await CourseModel.findByIdAndUpdate(courseId, req.body, {
      new: true,
    });
    await course.save();
    res.status(200).json({ message: "Course updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { addCourse, getCourseById, updateCourse };
