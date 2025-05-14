const bcrypt = require("bcryptjs");

// Check if newPassword is in the hashed password history
const isInPasswordHistory = async (newPassword, passwordHistory) => {
  for (let oldHashed of passwordHistory) {
    const isMatch = await bcrypt.compare(newPassword, oldHashed);
    if (isMatch) return true;
  }
  return false;
};

const updatePasswordHistory = async (passwordHistory, newHashedPassword) => {
    if (!Array.isArray(passwordHistory)) {
        passwordHistory = [];
    }
  
    passwordHistory.push(newHashedPassword);
  
    if (passwordHistory.length > 6) {
        passwordHistory = passwordHistory.slice(passwordHistory.length - 6);
    }
  
    return passwordHistory;
  };
  
  module.exports = { isInPasswordHistory, updatePasswordHistory };
