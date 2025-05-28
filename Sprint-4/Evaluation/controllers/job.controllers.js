const JobModel = require("../models/job.model");
const client = require("../utils/redisClient");

const createJob = async (req, res) => {
  try {
    const job = await JobModel.create({ ...req.body, createdBy: req.user.id });
    await job.save();
    await client.flushall(); //clear catch
    res.status(201).json({ message: "job created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const updateJob = async (req, res) => {
  try {
    const job = await JobModel.findByIdAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    await client.flushall();
    res.json({ message: "job updated", job });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const deleteJob = async (req, res) => {
  try {
    const job = await JobModel.findByIdAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    await client.flushall();
    res.status(200).json({ message: "job deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
module.exports = { createJob, updateJob, deleteJob };
