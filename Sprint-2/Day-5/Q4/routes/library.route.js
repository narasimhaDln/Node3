const express = require("express");
const router = express.Router();
const {
  removeBookFromLibrary,
  getBooksByCriteria,
  getLibrariesByGenres,
  addGenreToBook,
  getAllBooks,
} = require("../controllers/library.controllers");
router.get("/get-all-books", getAllBooks);
router.put("/add-genre/:libraryId/:bookTitle", addGenreToBook);
router.get("/get-libraries-by-genres", getLibrariesByGenres);
router.get("/get-books-by-criteria", getBooksByCriteria);
router.delete("/remove-book/:libraryId/:bookTitle", removeBookFromLibrary);
module.exports = router;
