const UserModel = require("../models/user.model");
const BookModel = require("../models/book.model");
const express = require("express");
const router = express.Router();
router.post("/add-user", async (req, res) => {
  try {
    const user = new UserModel(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: "something error in add user" });
  }
});
router.get("/user-rentals/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId).populate(
      "rentedBooks"
    );
    res.json(user.rentedBooks);
  } catch (error) {
    res.status(400).json({ message: "something error in add user" });
  }
});

module.exports = router;
