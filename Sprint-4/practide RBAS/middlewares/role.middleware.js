const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(401).json({ message: "Access Denaied" });
    }
    next();
  };
};
module.exports = checkRole;
