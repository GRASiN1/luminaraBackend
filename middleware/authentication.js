const { verifyToken } = require("../services/authentication");
const User = require("../models/user");

async function authenticateUser(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split("Bearer ")[1];
    if (!token) {
      // No token found after splitting
      req.user = null;
      return next();
    }
    try {
      const { user } = verifyToken(token);
      req.user = await User.findById(user).select("-password");
      return next();
    } catch (error) {
      console.error(error);
      req.user = null;
      return next();
    }
  } else {
    req.user = null;
    return next();
  }
}

module.exports = {
  authenticateUser,
};
