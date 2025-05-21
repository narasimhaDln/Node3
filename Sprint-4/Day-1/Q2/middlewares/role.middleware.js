const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      console.log("User in middleware:", req.user);
      return res.status(403).json({ message: "Access Denaied" });
    }
    next();
  };
};
module.exports = checkRole;
