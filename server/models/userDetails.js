// models/userDetails.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
  userType: String,
});

mongoose.model('UserInfo', UserSchema);
