const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "student" }],
});
const CourseModel = mongoose.model("course", courseSchema);
module.exports = CourseModel;
