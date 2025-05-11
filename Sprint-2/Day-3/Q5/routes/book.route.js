const express = require("express");

const router = express.Router();
const UserModel = require("../models/user.model");
const BookModel = require("../models/book.model");
router.post("/add-book", async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    if (!title || !author) {
      return res.status(404).json({ message: "title and author is required" });
    }
    const book = new BookModel(req.body);
    console.log(book);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: "something went wrong in add book" });
  }
});

router.post("/rent-book", async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const user = await UserModel.findById(userId);
    const book = await BookModel.findById(bookId);
    user.rentedBooks.push(bookId);
    book.rentedBy.push(userId);
    await user.save();
    await book.save();
    res.json({ message: "Book rented successfully" });
  } catch (error) {
    res.status(400).json({ message: "something went wrong in add book" });
  }
});
router.get("/book-rentals/:bookId", async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.bookId).populate(
      "rentedBy"
    );
    res.json(book.rentedBy);
  } catch (error) {
    res.status(400).json({ message: "something went wrong in add book" });
  }
});
module.exports = router;
