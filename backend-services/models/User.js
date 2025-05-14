const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
  style: String,
  color: String,
  size: String
});

const userSchema = new mongoose.Schema({
  age: Number,
  name: String,
  gender: String,
  country: String,
  password: String,
  passwordHistory: {
    type: [String],
    default: []
  },
  preference: preferenceSchema,
  role: { type: String, default: 'user' }
});

module.exports = mongoose.model('User', userSchema);