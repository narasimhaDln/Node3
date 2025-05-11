const express = require("express");
const TaskModel = require("../models/task.model");

const addTask = async (req, res) => {
  try {
    const task = await TaskModel.create(req.body);
    await task.save();
    res.status(201).json({ message: "task created", task });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find();
    res.status(200).json({ message: "all tasks", tasks });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const updateTask = async (req, res) => {
  const id = req.params.id;
  try {
    const updateTask = await TaskModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await updateTask.save();
    res.status(200).json({ message: "task updated", updateTask });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTask = await TaskModel.findByIdAndDelete(id);
    res.status(200).json({ message: "task deleted", deleteTask });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const getPaginationTasks = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const skip = Number(req.query.skip) || 0;
    const tasks = await TaskModel.find().limit(limit).skip(skip);
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const getTaskByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const tasks = await TaskModel.find({ status });
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const getHighPriority = async (req, res) => {
  try {
    const tasks = await TaskModel.find({ priority: "high" });
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
module.exports = {
  addTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getHighPriority,
  getTaskByStatus,
  getPaginationTasks,
};
