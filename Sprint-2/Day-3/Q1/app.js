const express = require("express");
const connection = require("./config/db");
const UserModel = require("./models/user.model");
const ProfileModel = require("./models/profile.model");
const dotenv = require("dotenv").config();
const app = express();
app.use(express.json());

app.get("/user", async (req, res) => {
  const users = await UserModel.find();
  res.send(users);
});
app.get("/profile", async (req, res) => {
  const profile = await ProfileModel.find();
  res.send(profile);
});
app.post("/user-data", async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(201).json({ message: "user created", user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.post("/profile-data", async (req, res) => {
  try {
    const profile = await ProfileModel.create(req.body);
    res.status(201).json({ message: "profile created", profile });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const profiles = await ProfileModel.find({ user: userId }).populate(
      "user",
      "name email"
    );
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.listen(5060, () => {
  connection();
  console.log("server running at 5060");
});
