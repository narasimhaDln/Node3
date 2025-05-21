const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      console.log("decoded", req.user);
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};

module.exports = checkRole;
