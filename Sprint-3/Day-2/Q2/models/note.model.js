const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const NoteModel = mongoose.model("note", noteSchema);
module.exports = NoteModel;
