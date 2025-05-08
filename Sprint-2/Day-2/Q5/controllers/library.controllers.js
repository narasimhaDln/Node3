const express = require("express");

const LibraryModel = require("../models/library.model");

const createBook = async (req, res) => {
  try {
    const { title, author, status } = req.body;
    const book = await LibraryModel.create(req.body);
    await book.save();
    res.status(201).json({ message: "books is created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const getAllBooks = async (req, res) => {
  const book = await LibraryModel.find();
  res.send(book);
};
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const books = await LibraryModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await books.save();
    res.status(200).json({ message: "book is update" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const deleteBook = async (req, res) => {
  try {
    const deleteBook = await LibraryModel.findByIdAndDelete(req.params.id);
    if (!deleteBook) {
      return res.status(404).json({ message: "Book is not found" });
    }
    res.status(200).json({ message: "book is deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const borrowBook = async (req, res) => {
  const { id } = req.params;
  const { borrowerName } = req.body;
  try {
    const book = await LibraryModel.findById(id);
    if (!book) {
      return res.status(400).json({ message: "book not found" });
    }
    if (book.status !== "available") {
      return res
        .status(400)
        .json({ message: "book is not available for borrowing" });
    }
    const borrowDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(borrowDate.getDate() + 14);
    book.status = "borrowed";
    book.borrowerName = borrowerName;
    book.borrowDate = borrowDate;
    book.returnDate = returnDate;
    book.overdueFees = 0;
    await book.save();
    res.status(200).json({ message: "book borrowed successful" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
module.exports = {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
  borrowBook,
};
