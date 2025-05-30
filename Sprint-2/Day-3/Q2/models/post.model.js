const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  createdAt: { type: Date },
});

const PostModel = mongoose.model("post", postSchema);
module.exports = PostModel;
