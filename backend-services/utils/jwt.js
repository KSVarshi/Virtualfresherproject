const jwt = require("jsonwebtoken");
const crypto = require("crypto");

let generatedSecret = crypto.randomBytes(64).toString("hex");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, generatedSecret, {
    expiresIn: "1h",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, generatedSecret);
};

module.exports = { generateToken, verifyToken, generatedSecret };
