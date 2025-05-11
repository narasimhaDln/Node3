const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 3 },
  description: { type: String },
  status: { type: String, enum: ["pending", "in-progress", "completed"] },
  dueDate: { type: Date },
  priority: { type: String, enum: ["low", "medium", "high"] },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
});
const TaskModel = mongoose.model("task", taskSchema);
module.exports = TaskModel;
