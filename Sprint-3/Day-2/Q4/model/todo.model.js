const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});
const TodoModel = mongoose.model("todo", todoSchema);
module.exports = TodoModel;
