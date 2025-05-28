const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(401).json("Access Denied");
    }
    next();
  };
};
module.exports = checkRole;
