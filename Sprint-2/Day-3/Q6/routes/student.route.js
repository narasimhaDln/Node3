const express = require("express");
const {
  addCourse,
  getCourseById,
  updateCourse,
} = require("../controllers/course.controllers");
const {
  addStudent,
  enrollStudent,
  unEnrollStudent,
  getStudentById,
} = require("../controllers/student.constrollers");

const router = express.Router();

router.post("/add-student", addStudent);
router.post("/add-course", addCourse);
router.post("/enroll-student", enrollStudent);
router.post("/unenroll-student", unEnrollStudent);
router.get("/student-courses/:studentId", getStudentById);
router.get("/course-enrollments/:courseId", getCourseById);
router.put("/update-course/:courseId", updateCourse);

module.exports = router;
