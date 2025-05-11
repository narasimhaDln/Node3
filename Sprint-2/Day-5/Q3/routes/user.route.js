const express = require("express");
const router = express.Router();
const {
  getUsers,
  addProfile,
  addUser,
} = require("../controllers/user.controllers");
router.post("/add-user", addUser);
router.post("/add-profile/:userId", addProfile);
router.get("/get-users", getUsers);
module.exports = router;
