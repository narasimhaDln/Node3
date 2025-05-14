const jwt = require("jsonwebtoken");
const AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "please login first" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, "secrete_key", function (err, decoded) {
    if (err) {
      return res.status(400).json({ message: "invalid token" });
    }
    req.use = decoded;
    next();
  });
};
module.exports = AuthMiddleware;
