const validateMiddleware = (req, res, next) => {
  const { title, description, priority } = req.body;
  if (!title || !description || !priority) {
    return res.status(400).json({ message: "Data not received" });
  }
  if (!["low", "medium", "high"].includes(priority)) {
    return res.status(400).json({ message: "invalid Priority values" });
  }
  next();
};
module.exports = validateMiddleware;
