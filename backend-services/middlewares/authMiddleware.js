const jwt = require("jsonwebtoken");
const User = require("../models/User");
const jwtToken = require("../utils/jwt")

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({successFlag: false, error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwtToken.verifyToken(token);
    req.User = await User.findById(decoded.id).select("-password");
    if (!req.User) {
      return res.status(401).json({ successFlag: false, error: "User not found" });
    }
    next();
  } catch (error) {
    res.status(401).json({successFlag: false, error: "Invalid token" });
  }
};
