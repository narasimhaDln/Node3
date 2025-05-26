const express = require("express");
const app = express();
app.use(express.json());

let todos = [];
app.post("/todos", (req, res) => {
  const { id, text } = req.body;
  if (!id || !text) {
    return res.status(400).json({ error: "Missing id or text" });
  }
  todos.push({ id, text });
  res.status(201).json({ id, text });
});

app.get("/todos", (req, res) => {
  res.json(todos);
});
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: "To-Do not found" });
  }
  if (!text) {
    return res.status(400).json({ error: "Missing text in body" });
  }
  todo.text = text;
  res.json(todo);
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "To-Do not found" });
  }
  const deleted = todos.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = app;
