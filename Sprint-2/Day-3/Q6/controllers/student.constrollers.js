const express = require("mongoose");
const StudentModel = require("../models/student.model");
const CourseModel = require("../models/course.model");

const addStudent = async (req, res) => {
  try {
    const student = await StudentModel.create(req.body);
    await student.save();
    res.status(201).json({ message: "student is created" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const enrollStudent = async (req, res) => {
  const { courseId, studentId } = req.body;
  try {
    const student = await StudentModel.find(studentId);
    const course = await CourseModel.find(courseId);
    if (!student || !course) {
      return res.status(404).json({ message: "student and course not found" });
    }
    if (!student.enrolledCourses.includes(courseId)) {
      student.enrolledCourses.push(courseId);
    }
    if (!course.studentsEnrolled.includes(studentId)) {
      course.studentsEnrolled.push(studentId);
    }
    await student.save();
    await course.save();
    res.json({ message: "student enrolled in course" });
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
};
const unEnrollStudent = async (req, res) => {
  const { studentId, courseId } = req.body;
  try {
    await StudentModel.findByIdAndUpdate(studentId, {
      $pull: { enrolledCourses: courseId },
    });
    await CourseModel.findByIdAndUpdate(courseId, {
      $Pull: { studentsEnrolled: studentId },
    });
    res.json({ message: "student unenrolled from course" });
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
};
const getStudentById = async (req, res) => {
  try {
    const student = await StudentModel.findById(req.params.studentId).populate(
      "enrolledCourses"
    );
    if (!student) {
      return res.status(404).json({ message: "student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = { addStudent, enrollStudent, unEnrollStudent, getStudentById };
