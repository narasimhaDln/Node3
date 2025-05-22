const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  status: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});
const TodoModel = mongoose.model("todo", todoSchema);
module.exports = TodoModel;
