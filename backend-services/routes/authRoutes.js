const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const authController = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", authenticate, authController.changePassword);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
