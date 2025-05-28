const express = require("express");
const jobRouter = express.Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const {
  createJob,
  updateJob,
  deleteJob,
  allJobs,
} = require("../controllers/job.controllers");
jobRouter.use(auth, role("admin"));
jobRouter.post("/data", createJob);
jobRouter.put("/update/:id", updateJob);
jobRouter.delete("/delete/:id", deleteJob);
jobRouter.get("/jobs", allJobs);
module.exports = jobRouter;
