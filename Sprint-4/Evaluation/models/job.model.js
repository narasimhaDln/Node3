const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  requiredSkills: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});
const JobModel = mongoose.model("job", jobSchema);
module.exports = JobModel;
