const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  title: { type: String },
  description: { type: String },
  status: { type: String },
});
const TodoModel = mongoose.model("todo", todoSchema);
module.exports = TodoModel;
