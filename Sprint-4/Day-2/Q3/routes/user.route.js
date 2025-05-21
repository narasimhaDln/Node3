const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailer");
const express = require("express");
const userRouter = express.Router();
require("dotenv").config();
userRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hash, role });
    await user.save();
    res.status(201).json({ message: "Signup successful", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: req.user.email,
      subject: "Reset Your Password",
      text: `Click to reset your password: ${resetLink}`,
    });

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = userRouter;
