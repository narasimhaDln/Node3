const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  email: { type: String, unique: true },
  rentedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "books" }],
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
