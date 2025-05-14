const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("./models/user.model");
const connection = require("./config/db");
const AuthMiddleware = require("./middleware/auth.middleware");
const TodoModel = require("./models/todo.model");
const AdminControl = require("./middleware/admin.middleware");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await UserModel.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ message: "user already exist" });
    }
    const hash = bcrypt.hashSync(password, 10);
    await UserModel.create({ name, email, password: hash });
    res.status(201).json({ message: "signup successfully" });
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    const isPasswordCOrrect = bcrypt.compareSync(password, user.password);
    if (isPasswordCOrrect) {
      const token = jwt.sign({ userInfo: user }, "our_secret_key");
      return res.status(201).json({ message: "login successful", toke: token });
    } else {
      res.status(404).json({ message: "login Failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});
///curd operations
app.post("/todo", AuthMiddleware, async (req, res) => {
  const { title, description, complected } = req.body;
  try {
    const newTodo = await TodoModel({
      title,
      description,
      complected,
      createdBy: req.user.id,
    });
    await newTodo.save();
    res.json(201).json({ message: "todo created successful" });
  } catch (error) {
    res.status(400).json({ message: "something wrong in todo route" });
  }
});
app.put("/todo/:id", AuthMiddleware, async (req, res) => {
  try {
    const todo = await TodoModel.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!todo) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    Object.assign(todo.req.body);
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: "Something wrong in put" });
  }
});
app.delete("/todo:id", AuthMiddleware, async (req, res) => {
  const deleteTodo = await TodoModel.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.id,
  });
  if (!deleteTodo) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  res.json({ message: "Todo deleted" });
});

app.get("/todos", (req, res) => {
  const todo = req.body;
  res.send(todo);
});
app.get("/admin/todos", AuthMiddleware, AdminControl, async (req, res) => {
  const todos = await TodoModel.find();
  res.json(todos);
});
app.delete(
  "/admin/todos/:id",
  AuthMiddleware,
  AdminControl,
  async (req, res) => {
    await TodoModel.findByIdAndDelete(req.params.id);
    res.json({ message: "todo deleted by Admin" });
  }
);
app.listen(5000, () => {
  connection();
  console.log("server is running at 5000");
});
