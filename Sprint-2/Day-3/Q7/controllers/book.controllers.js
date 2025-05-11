const express = require("express");
const BookModel = require("../models/book.model");
const MemberModel = require("../models/member.model");
const addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ message: "Book added", book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const borrowBook = async (req, res) => {
  try {
    const { memberId, bookId } = req.body;
    const book = await Book.findById(bookId);
    if (book.status === "borrowed")
      return res.status(400).json({ error: "Book already borrowed" });

    const member = await Member.findById(memberId);
    book.status = "borrowed";
    book.borrowers.push(memberId);
    member.borrowedBooks.push(bookId);

    await book.save();
    await member.save();

    res.status(200).json({ message: "Book borrowed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const returnBook = async (req, res) => {
  try {
    const { memberId, bookId } = req.body;
    const book = await Book.findById(bookId);
    const member = await Member.findById(memberId);

    book.borrowers = book.borrowers.filter((b) => b.toString() !== memberId);
    if (book.borrowers.length === 0) book.status = "available";

    member.borrowedBooks = member.borrowedBooks.filter(
      (b) => b.toString() !== bookId
    );

    await book.save();
    await member.save();

    res.status(200).json({ message: "Book returned" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getBookBorrowers = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate("borrowers");
    res.status(200).json({ borrowers: book.borrowers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Book updated", book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    await Member.updateMany({}, { $pull: { borrowedBooks: book._id } });
    res.status(200).json({ message: "Book deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  deleteBook,
  updateBook,
  getBookBorrowers,
  returnBook,
  borrowBook,
  addBook,
};
