const mongoose = require("mongoose");

const passwordResetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tokenHash: {
    type: String,
    required: true,
    unique: true,
  },
  tokenExpiry: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema);
