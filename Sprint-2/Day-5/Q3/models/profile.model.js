const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
  profileName: {
    type: String,
    enum: ["fb", "twitter", "github", "instagram"],
    required: true,
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Invalid URL format",
    },
  },
});
const ProfileModel = mongoose.model("profile", profileSchema);
module.exports = ProfileModel;
