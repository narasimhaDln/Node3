const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  age: { type: Number },
});
const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
