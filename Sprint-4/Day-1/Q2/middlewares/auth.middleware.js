const jwt = require("jsonwebtoken");
const AuthMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "shhhhh");
    if (decoded) {
      req.user = decoded
      next();
    } else {
      return res.status(400).json({ message: "please login" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ message: "unauthorized" });
  }
};
module.exports = AuthMiddleware;
