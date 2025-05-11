const mongoose = require("mongoose");
const librarySchema = new mongoose.Schema({
  name: String,
  books: [bookSchema],
});
const LibraryModel = mongoose.model("library", librarySchema);
module.exports = LibraryModel;
