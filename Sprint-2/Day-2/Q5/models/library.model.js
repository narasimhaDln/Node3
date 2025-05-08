const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, enum: ["available", "borrowed", "reversed"] },
  borrowerName: { type: String },
  borrowDate: { type: Date },
  returnDate: { type: Date },
  overdueFees: { type: Number, required: true },
});
const LibraryModel = mongoose.model("library", librarySchema);
module.exports = LibraryModel;