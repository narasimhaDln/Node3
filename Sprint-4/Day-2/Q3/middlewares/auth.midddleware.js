const jwt = require("jsonwebtoken");
require("dotenv").config();
const AuthMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      return res.status(401).json({ message: "login failed" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
module.exports = AuthMiddleware;
