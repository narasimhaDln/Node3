const express = require("express");
const TodoModel = require("../models/todo.model");
const todoRouter = express.Router();
const redis = require("../redis/redis.client");
const AuthMiddleware = require("../middlewares/auth.middleware");
todoRouter.use(AuthMiddleware);
todoRouter.post("/data", async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const todo = await TodoModel.create({ title, description, status });

    res.status(201).json({ message: "todo created", todo });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
todoRouter.get("/get-allTodos", async (req, res) => {
  try {
    const cacheKey = `todos:${req.userId}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }
    const todos = await TodoModel.find({ userId: req.userId });
    await redis.set(cacheKey, JSON.stringify(todos), "EX", 100);
    res.status(200).json(todos);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
todoRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTodo = await TodoModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await updatedTodo.save();
    res.status(200).json({ message: "todo updated", updatedTodo });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
todoRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTodo = await TodoModel.findByIdAndDelete(id);
    res.status(200).json({ message: "todo deleted", deleteTodo });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
module.exports = todoRouter;
