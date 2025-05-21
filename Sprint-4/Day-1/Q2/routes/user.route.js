const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const UserModel = require("../models/user.model");
const AuthMiddleware = require("../middlewares/auth.middleware");
const userRouter = express.Router();
userRouter.post("/signup", async (req, res) => {
  const { email, password, username, role } = req.body;
  try {
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "user already exist" });
    }
    const hash = bcrypt.hashSync(password, 10);
    await UserModel.create({
      email,
      password: hash,
      username,
      role: role,
    });
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
      const token = jwt.sign({ id: user._id, role: user.role }, "shhhhh");
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
  const newAccessToken = jwt.sign(
    { id: decoded.id, role: decoded.role },
    "shhhhh",
    {
      expiresIn: "15m",
    }
  );
  res.json({ AccessToken: newAccessToken });
});
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "interview@gmail.com",
    pass: "wlfn jzvf htpx dorh",
  },
});

userRouter.get("/sendMail", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: '"HR Team"', // From should be a valid address
      to: "narasimha34327@gmail.com",
      subject: "Confirm Interview Schedule",
      text: `We are pleased to inform you that you have been shortlisted for the Software Developer role. 
Your interview has been scheduled for this weekend. Please make sure to prepare well. We wish you all the best!`,
    });

    console.log("Message sent:", info.messageId);
    res
      .status(200)
      .json({ message: "Email sent successfully", messageId: info.messageId });
  } catch (error) {
    console.error("Error sending mail:", error.message);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = userRouter;
