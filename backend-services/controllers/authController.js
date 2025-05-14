const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const cartService = require("../services/cart.service.js")
const { generateToken } = require("../utils/jwt");
const {
  isInPasswordHistory,
  updatePasswordHistory,
} = require("../utils/passwordUtils");
const PasswordResetToken = require("../models/PasswordResetToken");

// Register User
exports.register = async (req, res) => {
  try {
    const { age, name, gender, country, password, preference } = req.body;

    // 🔍 Check if user with the same name already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({
        successFlag: false,
        message: "User is already registered.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      age,
      name,
      gender,
      country,
      password: hashedPassword,
      preference,
      passwordHistory: hashedPassword, // Initialize with first password
    });
    
    const user = await User.create(newUser);
    await cartService.createCart(user);
    await user.save();

    res
      .status(201)
      .json({ successFlag: true, message: "Registered successfully" });
  } catch (error) {
    res.status(500).json({ successFlag: false, error: "Registration failed" });
    console.log(error.message);
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user)
      return res
        .status(400)
        .json({ successFlag: false, error: "username is incorrect." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        successFlag: false,
        error: "Username or password is Incorrect.",
      });

    const token = generateToken(user);
    res.status(200).json({ successFlag: true, token });
  } catch (error) {
    res.status(500).json({ successFlag: false, error: "Login failed" });
  }
};

// Change Password with history check
exports.changePassword = async (req, res) => {
  try {
    const { name, newPassword } = req.body;
    const user = await User.findOne({ name });
    if (!user)
      return res
        .status(404)
        .json({ successFlag: false, error: "User not found" });

    const isReused = await isInPasswordHistory(
      newPassword,
      user.passwordHistory
    );
    if (isReused) {
      return res.status(400).json({
        successFlag: false,
        message:
          "Please use a different password. It matches one of your previous 6 passwords.",
      });
    }

    const newHashed = await bcrypt.hash(newPassword, 10);
    user.password = newHashed;
    user.passwordHistory = await updatePasswordHistory(
      user.passwordHistory,
      newHashed
    );
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Password update failed" });
  }
};

// Step 1: Request reset
exports.forgotPassword = async (req, res) => {
  const { name } = req.body;
  const user = await User.findOne({ name });

  // Always return success message to prevent username discovery
  if (!user)
    return res
      .status(404)
      .json({ successFlag: false, message: "User does not exist." });

  const token = crypto.randomBytes(64).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  await PasswordResetToken.findOneAndDelete({ userId: user._id });

  await PasswordResetToken.create({
    userId: user._id,
    tokenHash,
    tokenExpiry: Date.now() + 15 * 60 * 1000, // 15 mins
  });

  // Instead of sending username, return token for demo purposes
  res.status(200).json({
    successFlag: true,
    message: "Reset token generated",
    resetToken: token,
  });
};

// Step 2: Reset password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const tokenDoc = await PasswordResetToken.findOne({
    tokenHash,
    tokenExpiry: { $gt: Date.now() },
  });

  if (!tokenDoc) {
    return res
      .status(400)
      .json({ successFlag: false, message: "Invalid or expired token" });
  }

  const user = await User.findById(tokenDoc.userId);
  if (!user)
    return res
      .status(404)
      .json({ successFlag: false, message: "User not found" });

  // 🔒 Check password history
  const isReused = await isInPasswordHistory(newPassword, user.passwordHistory);
  if (isReused) {
    return res.status(400).json({
      successFlag: false,
      message:
        "Please use a different password. It matches one of your previous 6 passwords.",
    });
  }

  const newHashed = await bcrypt.hash(newPassword, 10);
  user.password = newHashed;
  user.passwordHistory = await updatePasswordHistory(
    user.passwordHistory,
    newHashed
  );
  await user.save();

  await PasswordResetToken.deleteOne({ _id: tokenDoc._id });

  res
    .status(200)
    .json({ successFlag: true, message: "Password successfully reset" });
};
