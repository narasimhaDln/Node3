const express = require("express");
const userRouter = express.Router();
const {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} = require("../controllers/auth.controllers");
const verifyToken = require("../middleware/verifyToken");
userRouter.get("/check-auth", verifyToken, checkAuth);
userRouter.post("/register", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
module.exports = userRouter;
