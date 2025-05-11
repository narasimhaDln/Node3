const mongoose = require("mongoose");
const studentSchema = mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  email: { type: String, required: true },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
    },
  ],
});
const StudentModel = mongoose.model("student", studentSchema);
module.exports = StudentModel;
