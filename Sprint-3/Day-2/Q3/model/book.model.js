const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  publishedYear: Number,
});
const BookModel = mongoose.model("book", bookSchema);
module.exports = BookModel;
