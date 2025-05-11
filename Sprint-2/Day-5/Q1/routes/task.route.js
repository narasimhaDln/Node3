const express = require("express");
const {
  addTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getPaginationTasks,
  getTaskByStatus,
  getHighPriority,
} = require("../controllers/task.controllers");
const router = express.Router();

router.post("/data", addTask);
router.get("/tasks", getAllTasks);
router.put("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);
router.get("/paginated", getPaginationTasks);
router.get("/status/:status", getTaskByStatus);
router.get("/high", getHighPriority);

module.exports = router;
