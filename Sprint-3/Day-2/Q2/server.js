const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const connection = require("./config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("./models/user.model");
const NoteModel = require("./models/note.model");
const AuthMiddleware = require("./middleware/auth.middleware");
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "user already exist" });
    }
    const hash = bcrypt.hashSync(password, 10);
    const user = await UserModel.create({ name, email, password: hash });
    await user.save();
    res.status(201).json({ message: "user signin" });
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
      const token = jwt.sign({ userId: user._id }, "secrete_key");
      return res.status(200).json({ message: "user logged", token });
    } else {
      return res.status(400).json({ message: "login failed" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
//curd routes
app.post("/data", AuthMiddleware, async (req, res) => {
  try {
    const note = await NoteModel.create(req.body);
    await note.save();
    res.status(201).json({ message: "note created", note });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.get("/all-notes", AuthMiddleware, async (req, res) => {
  try {
    const notes = await NoteModel.find();
    res.status(200).json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.put("/update/:id", AuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const note = await NoteModel.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json({ message: "Note updated", note });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const note = await NoteModel.findByIdAndDelete(id);
    res.status(200).json({ message: "note deleted", note });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.listen(7080, () => {
  connection();
  console.log("server running at 7080");
});
