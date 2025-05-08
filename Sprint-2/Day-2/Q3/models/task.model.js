const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  priority: { type: String, enum: ["low", "medium", "high"] },
  isCompleted: { type: Boolean },
  completionDate: { type: Date },
  dueDate: { type: Date },
});
const TaskModel = mongoose.model("task", taskSchema);
module.exports = TaskModel;
