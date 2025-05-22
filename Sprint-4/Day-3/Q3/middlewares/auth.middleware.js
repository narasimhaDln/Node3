const jwt = require("jsonwebtoken");
const AuthMiddleware = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "shhhhh");
    if (decoded) {
      req.user = decode;
      next();
    } else {
      return res.status(401).json({ message: "Please login" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
module.exports = AuthMiddleware;
