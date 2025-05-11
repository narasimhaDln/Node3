const express = require("express");
const connection = require("./config/db");
const UserModel = require("./models/user.model");
const PostModel = require("./models/post.model");
const dotenv = require("dotenv").config();
const app = express();
app.use(express.json());

app.post("/add-user", async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(201).json({ message: "User added", user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to add user", error: err.message });
  }
});
app.post("/add-post", async (req, res) => {
  try {
    const { title, author, content } = req.body;
    const userExist = await UserModel.findById(author);
    if (!userExist) {
      return res.status(404).json({ message: "Invalid userid" });
    }
    const post = await PostModel.create(req.body);
    await post.save();
    res.status(201).json({ message: "post is created", post });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to add user", error: err.message });
  }
});
app.get("/posts", async (req, res) => {
  try {
    const post = await PostModel.find().populate("author", "name email");
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});
app.listen(8080, () => {
  connection();
  console.log("server running at 8080");
});
