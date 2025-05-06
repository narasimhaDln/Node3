const primeLimitChecker = (req, res, next) => {
  const num = Number(req.params.num);
  if (num > 1000) {
    return res.status(400).json({ message: "Number is to Large" });
  }
  next();
};
module.exports = primeLimitChecker;
