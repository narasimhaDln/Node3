const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  rentedBy: [
    { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  ],
});
const BookModel = mongoose.model("books", bookSchema);
module.exports = BookModel;
