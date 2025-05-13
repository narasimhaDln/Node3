const mongoose = require("mongoose");
const borrowerSchema = new mongoose.Schema({
  name: String,
  email: String,
  membershipDate: Date,
});
const BorrowerModel = mongoose.model("borrower", borrowerSchema);
module.exports = BorrowerModel;
