const { default: mongoose } = require("mongoose");
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
const allJobs = async (req, res) => {
  try {
    const jobs = await JobModel.find();
    res.json(jobs);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
const updateJob = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await JobModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!job) {
      return res.status(404).json({ message: "job not found" });
    }
    await client.flushall();

    res.status(200).json({ message: "job updated", job });
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
    res.status(200).json({ message: "job deleted", job });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
module.exports = { createJob, updateJob, deleteJob, allJobs };
