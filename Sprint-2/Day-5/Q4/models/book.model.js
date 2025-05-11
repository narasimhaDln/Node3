const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  title: { type: String },
  author: { type: String },
  publicationYear: { type: Number },
  genres: [String],
});
const BookModel = mongoose.model("book", bookSchema);
module.exports = BookModel;
