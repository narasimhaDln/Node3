const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
});
const StudentModel = mongoose.model("student", studentSchema);
module.exports = StudentModel;
