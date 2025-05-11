const UserModel = require("../models/user.model");

const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.create({ name, email, password });
    res.status(201).json({ message: "user create", user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const addProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { profileName, url } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profiles.push({ profileName, url });
    await user.save();
    res.status(200).json({ message: "profile added", user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const getUsers = async (req, res) => {
  try {
    const { profile } = req.query;
    let users;
    if (profile) {
      users = await UserModel.find({ "profiles.profileName": profile });
    } else {
      users = await UserModel.find();
    }
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
module.exports = { getUsers, addProfile, addUser };
