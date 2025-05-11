const express = require("express");
const router = express.Router();
const {
  deleteBook,
  updateBook,
  getBookBorrowers,
  returnBook,
  borrowBook,
  addBook,
} = require("../controllers/book.controllers");
router.post("/add-book", addBook);
router.post("/borrow-book", borrowBook);
router.post("/return-book", returnBook);
router.get("/book-borrowers/:bookId", getBookBorrowers);
router.put("/update-book/:bookId", updateBook);
router.delete("/delete-book/:bookId", deleteBook);

module.exports = router;
