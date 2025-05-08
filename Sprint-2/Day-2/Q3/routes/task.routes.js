const express = require("express");
const {
  postData,
  getAllTasks,
  updateTask,
  deleteTask,
} = require("../controllers/task.controllers");
const validateMiddleware = require("../middlewares/task.middleware");
const router = express.Router();
router.post("/data", validateMiddleware, postData);
router.get("/all-tasks", getAllTasks);
router.patch("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);
module.exports = router;
