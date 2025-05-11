const mongoose = require("mongoose");
const memberSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  borrowedBooks: { type: mongoose.Schema.Types.ObjectId, ref: "book" },
});
const MemberModel = mongoose.model("member", memberSchema);
module.exports = MemberModel;
