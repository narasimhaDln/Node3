const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
});
const ReviewModel = mongoose.model("review", reviewSchema);
module.exports = ReviewModel;
