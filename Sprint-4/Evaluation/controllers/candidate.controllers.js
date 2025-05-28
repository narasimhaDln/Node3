const JobModel = require("../models/job.model");

const getMatchingJobs = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const candidate = await user.findById(candidateId);
    if (!candidate || candidate.role !== "candidate") {
      return res.status(403).json({ message: "Access Denied" });
    }
    const catchKey = `jobs:${candidateId}:${candidate.skills.sort().join(",")}`;
    const cached = await client.get(catchKey);
    if (cached) {
      return res
        .status(200)
        .json({ source: "cache", jobs: JSON.parse(cached) });
    }
    const jobs = await JobModel.find({
      requiredSkills: { $in: candidate.skills },
    });
    await client.set(catchKey.JSON.stringify(jobs));
    res.status(200).json({ message: "database", jobs });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
