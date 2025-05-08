const express = require("express");
const {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
} = require("../controllers/library.controllers");
const {
  libraryData,
  borrowingLimit,
} = require("../middlewares/library.middlewares");
const app = express();

const router = express.Router();

router.get("/all-books", getAllBooks);
router.post("/books", libraryData, createBook);
router.patch("/book/:id", updateBook);
router.patch("/borrow/:id", borrowingLimit, borrowBook);
router.delete("/delete-book/:id", deleteBook);

module.exports = router;
