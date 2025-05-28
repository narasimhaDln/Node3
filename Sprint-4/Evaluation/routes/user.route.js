const express = require("express");
const userRoutes = express.Router();
const { signup, login } = require("../controllers/user.controllers");

userRoutes.post("/register", signup);
userRoutes.post("/loginUser", login);
module.exports = userRoutes;
