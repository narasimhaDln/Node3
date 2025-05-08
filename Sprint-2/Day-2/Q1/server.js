const express = require("express");
const dotenv = require("dotenv").config();
const connection = require("./config/db");
const TaskModel = require("./model/task.model");
const app = express();
app.use(express.json());
app.get("/test", (req, res) => {
  res.send("this is test route working fine");
});
app.post("/data", async (req, res) => {
  const { title, description, dueDate, status } = req.body;
  try {
    const task = await TaskModel.create({
      title,
      description,
      dueDate,
      status,
    });
    await task.save();
    res.status(201).json({ message: "task created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.get("/all-tasks", async (req, res) => {
  try {
    const task = await TaskModel.find();
    res.status(200).json({ message: "all tasks", task });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await TaskModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await updated.save();
    res.status(200).json({ message: "Task updated", updated });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await TaskModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Task deleted", deleted });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
});
app.listen(3040, () => {
  connection();
  console.log("server running 3040");
});
