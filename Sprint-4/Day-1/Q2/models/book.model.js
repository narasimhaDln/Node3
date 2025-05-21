const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  service: String,
  dateTime: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled"],
    default: "pending",
  },
});
const BookModel = mongoose.model("book", bookSchema);
module.exports = BookModel;
