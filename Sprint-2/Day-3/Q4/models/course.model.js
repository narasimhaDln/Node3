const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  description: { type: String },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  ],
});
const CourseModel = mongoose.model("course", courseSchema);
module.exports = CourseModel;
