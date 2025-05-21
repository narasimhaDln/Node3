const express = require("express");
const UserModel = require("../models/user.model");
const userRouter = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRETE
      );
      console.log(token);

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
