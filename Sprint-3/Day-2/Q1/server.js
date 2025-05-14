const express = require("express");
const UserModel = require("./models/user.model");
const connection = require("./config/db");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authMiddleware = require("./middleware/auth.middleware");
require("dotenv").config();
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "user exist" });
    }
    const hash = bcrypt.hashSync(password, 10);
    const user = await UserModel.create({ name, email, password: hash });
    await user.save();
    res.status(201).json({ message: "user signin" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await UserModel.findOne({ email: email });
    if (!userExist) {
      return res.status(400).json({ message: "user exist" });
    }
    const isPassword = bcrypt.compareSync(password, userExist.password);
    if (isPassword) {
      const token = jwt.sign({ foo: "bar" }, "secrete_key");
      return res.status(200).json({ message: "user logged", token });
    } else {
      return res.status(400).json({ message: "login failed" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.get("/protectedRoute", authMiddleware, (req, res) => {
  res.send("this is protected route");
});
app.listen(4050, () => {
  connection();
  console.log("server running at 4050");
});
