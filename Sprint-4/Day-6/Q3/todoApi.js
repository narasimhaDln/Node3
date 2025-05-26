const express = require("express");
const app = express();
app.use(express.json());

const mockDatabase = require("./mockDataBase");

app.post("/todos", (req, res) => {
  const todo = req.body;
  if (!todo.text) {
    return res.status(400).json({ error: "Text is required" });
  }
  mockDatabase.addTodo(todo);
  res.status(201).json(todo);
});

app.get("/todos", (req, res) => {
  res.json(mockDatabase.getTodos());
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const updatedTodo = req.body;
  const updated = mockDatabase.updateTodo(id, updatedTodo);
  if (!updated) return res.status(404).json({ error: "To-Do not found" });
  res.status(200).json(updated);
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const deleted = mockDatabase.deleteTodo(id);
  if (!deleted) return res.status(404).json({ error: "To-Do not found" });
  res.status(204).send();
});

module.exports = app;
