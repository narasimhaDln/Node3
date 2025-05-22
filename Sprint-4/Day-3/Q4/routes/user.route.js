const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const UserModel = require("../models/user.model");
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "user already exist" });
    }
    const hash = bcrypt.hashSync(password, 10);
    const user = await UserModel.create({ name, email, password: hash, role });
    await user.save();
    res.status(201).json({ message: "user signin", user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    const isPassword = bcrypt.compareSync(password, user.password);
    if (isPassword) {
      const token = jwt.sign({ userId: user._id, role: user.role }, "shhhhh");
      return res.status(200).json({ message: "user login", token });
    } else {
      return res.status(400).json({ message: "login failed" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
module.exports = userRouter;
