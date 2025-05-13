const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());
const connection = require("./config/db");
const BookModel = require("./models/books.model");
const BorrowerModel = require("./models/borrowers.model");
const LoanModel = require("./models/loans.model");
app.get("/test", (req, res) => {
  res.send("this is testing route working fine");
});
app.post("/book-data", async (req, res) => {
  try {
    const book = await BookModel.create(req.body);
    await book.save();
    res.status(201).json({ message: "Book is created", book });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.post("/borrower-data", async (req, res) => {
  try {
    const borrower = await BorrowerModel.create(req.body);
    await borrower.save();
    res.status(201).json({ message: "borrower is created", borrower });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.post("/loan-data", async (req, res) => {
  try {
    const loans = await LoanModel.create(req.body);
    await loans.save();
    res.status(201).json({ message: "loans created", loans });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.get("/analytics/borrowed-books", async (req, res) => {
  try {
    const borrowedBooks = await LoanModel.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $lookup: {
          from: "borrowers",
          localField: "borrowerId",
          foreignField: "_id",
          as: "borrowers",
        },
      },
      { $group: { _id: "$borrowerId", borrowedBooks: { $push: "$books" } } },
    ]);
    if (!borrowedBooks) {
      return res.status(400).json({ message: "Invalid  borrowedBooks Data" });
    }
    res.status(200).json(borrowedBooks);
  } catch (error) {
    res.status(400).json("something went wrong in post loans");
  }
});
app.get("/analytics/top-borrowed-books", async (req, res) => {
  try {
    const result = await LoanModel.aggregate([
      { $group: { _id: "$bookId", borrowedBooks: { $sum: 1 } } },
      { $sort: { borrowedBooks: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
    ]);
    if (!result.length) {
      return res
        .status(400)
        .json({ message: "Invalid  TopBorrowedBooks Data" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json("something went wrong in post loans");
  }
});
app.get("/analytics/borrower-history/:id", async (req, res) => {
  try {
    const borrowerId = req.params.id;
    const history = await LoanModel.aggregate([
      { $match: { borrowerId: mongoose.Types.ObjectId(borrowerId) } },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
    ]);
    if (!history.length) {
      return res
        .status(400)
        .json({ message: "Invalid  TopBorrowedBooks Data" });
    }
    res.status(200).json(history);
  } catch (error) {
    res.status(400).json("something went wrong in post loans");
  }
});
app.get(" /analytics/frequent-borrowers", async (req, res) => {
  try {
    const result = await LoanModel.aggregate([
      { $group: { _id: "$borrowerId", borrowedCount: { $sum: 1 } } },
      { $match: { borrowedCount: { $gt: 5 } } },
      {
        $lookup: {
          from: "borrowers",
          localField: "_id",
          foreignField: "_id",
          as: "borrower",
        },
      },
    ]);
    if (!result.length) {
      return res
        .status(400)
        .json({ message: "Invalid  TopBorrowedBooks Data" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json("something went wrong in post loans");
  }
});
app.get("/analytics/loan-reports", async (req, res) => {
  try {
    let result = await LoanModel.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $lookup: {
          from: "borrowers",
          localField: "borrowerId",
          foreignField: "_id",
          as: "borrowers",
        },
      },
    ]);
    if (!result.length) {
      return res
        .status(400)
        .json({ message: "Invalid  TopBorrowedBooks Data" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json("something went wrong in post loans");
  }
});
app.listen(8080, () => {
  connection();
  console.log("server running at 8080");
});
