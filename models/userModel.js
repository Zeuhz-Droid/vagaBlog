const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  last_name: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  testPassword,
  userPassword
) {
  return await bcrypt.compare(testPassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// Users should have a first_name, last_name, email, password, (you can add other attributes you want to store about the user)
// A user should be able to sign up and sign in into the blog app
// Use JWT as authentication strategy and expire the token after 1 hour
// A blog can be in two states; draft and published
// Logged in and not logged in users should be able to get a list of published blogs created
