const express = require("express");
const TaskModel = require("../models/task.model");
const postData = async (req, res) => {
  try {
    const tasks = await TaskModel.create(req.body);
    await tasks.save();
    res.status(201).json({ message: "Tasks are created" });
  } catch (error) {
    console.log(error.message);
    res.status(201).json({ message: "Internal server error" });
  }
};
const getAllTasks = async (req, res) => {
  try {
    const task = await TaskModel.find();
    console.log(req.body);
    res.status(200).json({ message: "all tasks", task });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const updateTask = async (req, res) => {
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
};
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await TaskModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Task deleted", deleted });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
module.exports = { postData, getAllTasks, updateTask, deleteTask };
