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
  full_name: {
    type: String,
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
    default: 'user',
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function (next) {
  this.full_name = `${this.first_name} ${this.last_name}`;
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
