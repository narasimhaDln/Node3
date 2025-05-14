const express = require("express");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const connection = require("./config/db");
const UserModel = require("./model/user.model");
const BookModel = require("./model/book.model");
const ReviewModel = require("./model/reviews.model");
const AuthMiddleware = require("./middleware/auth.middleware");
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "user Exist" });
    }
    const hash = bcrypt.hashSync(password, 10);
    const user = await UserModel.create({ name, email, password: hash });
    res.status(201).json({ message: "user logged", user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    const isPassword = bcrypt.compareSync(password, user.password);
    if (isPassword) {
      const token = jwt.sign({ userInfo: user._id }, "secrete_key");
      return res.status(200).json({ message: "user logged", token });
    } else {
      return res.status(400).json({ message: "login failed" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
//public routes
app.get("/books", async (req, res) => {
  try {
    const book = await BookModel.find();
    res.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});

app.get("/book/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await BookModel.findOne(id);
    if (!book) {
      return res.status(400).json({ message: "book not found" });
    }
    const reviews = await ReviewModel.findById({ bookId: id });
    res.status(200).json({ book, reviews });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.get("/book", async (req, res) => {
  const user = await BookModel.find();
  res.send(user);
});
app.get("/book/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await BookModel.find(id);
    res.status(200).json({ message: "user", user });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});
//reviews model
app.post("/books/:id/reviews", AuthMiddleware, async (req, res) => {
  const { rating, comment } = req.body;
  const bookId = req.params.id;
  try {
    const book = await BookModel.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "book not found" });
    }
    const review = await ReviewsModel.create({
      user: req.userId,
      book: bookId,
      rating,
      comment,
    });
    await review.save();
    book.reviews.push(review._id);
    await book.save();
    res.status(201).json({ message: "review added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.put("/update/:id", AuthMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const review = await ReviewModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await review.save();
    res.status(200).json({ message: "review updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.delete("/delete/:ids", AuthMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await ReviewModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).json({ message: "review not found" });
    }
    res.status(200).json({ message: "review is deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.listen(8090, () => {
  connection();
  console.log("server running at 8090");
});
