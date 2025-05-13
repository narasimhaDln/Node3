const mongoose = require("mongoose");
const loanSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "book" },
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: "borrower" },
  loanDate: Date,
  returnDate: Date,
  status: { type: String, enum: ["borrowed", "returned", "overdue"] },
});
const LoanModel = mongoose.model("loan", loanSchema);
module.exports = LoanModel;
