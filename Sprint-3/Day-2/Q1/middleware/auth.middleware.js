const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const { token } = req.query;
  jwt.verify(token, "secrete_key", function (err, decoded) {
    if (err) {
      return res.status(400).json({ message: "please login first " });
    } else {
      next();
    }
  });
};

module.exports = authMiddleware;
