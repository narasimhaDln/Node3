const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const AuthMiddleware = require("../middlewares/auth.middleware");
const userRouter = express.Router();
userRouter.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "user already exist" });
    }
    const hash = bcrypt.hashSync(password, 10);
    await UserModel.create({ email, password: hash, username });
    res.status(201).json({ message: "user signin" });
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
      const token = jwt.sign({ foo: "bar" }, "shhhhh");
      res.status(200).json({ message: "user login", token });
    } else {
      return res.status(400).json({ message: "login failed" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
userRouter.get("/protected", AuthMiddleware, (req, res) => {
  res.send("You have access the protected routes");
});
userRouter.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "token required" });
  }
  const decoded = jwt.verify(refreshToken, "shhhhh");
  const newAccessToken = jwt.sign({ userId: decoded.userId }, "shhhhh", {
    expiresIn: "15m",
  });
  res.json({ token: newAccessToken });
});
userRouter.get("/dashboard", AuthMiddleware, (req, res) => {
  res.send("Welcome to the user");
});
module.exports = userRouter;
