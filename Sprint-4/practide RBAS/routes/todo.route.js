require("dotenv").config();
const express = require("express");
const TodoModel = require("../models/todo.model");

const AuthMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/role.middleware");
const todoRouter = express.Router();
todoRouter.post(
  "/data",
  AuthMiddleware,
  checkRole("user"),
  async (req, res) => {
    const { title, description, status } = req.body;
    try {
      const todo = await TodoModel.create({ title, description, status });
      await todo.save();
      res.status(201).json({ message: "Todos Added", todo });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "internal server error" });
    }
  }
);
todoRouter.get(
  "/all-todos",
  AuthMiddleware,
  checkRole("admin"),
  async (req, res) => {
    try {
      const todos = await TodoModel.find();
      res.json(todos);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "internal server error" });
    }
  }
);
module.exports = todoRouter;
