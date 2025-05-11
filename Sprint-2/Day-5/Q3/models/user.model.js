const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: (v) => validator.isEmail(v),
    message: "Invalid email format",
  },
  password: { type: String, required: true, minLength: 6 },
  profiles: [profileSchema],
});
const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
