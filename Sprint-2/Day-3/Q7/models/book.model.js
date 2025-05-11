const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  title: { String, required: true, minLength: 3 },
  author: { type: String, required: true },
  status: { type: String, enum: ["available", "borrowed"] },
  borrowers: { type: mongoose.Schema.Types.ObjectId, ref: "member" },
  createdAt: Date,
});
const BookModel = mongoose.model("book", bookSchema);

module.exports = BookModel;
