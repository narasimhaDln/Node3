const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
  bio: { type: String },
  socialMediaLinks: [String],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});
const ProfileModel = mongoose.model("profile", profileSchema);
module.exports = ProfileModel;
