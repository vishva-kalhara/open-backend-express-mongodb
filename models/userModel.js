const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Email is a required field'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'Password is a required field'],
    minlength: 8,
    trim: true,
    select: false,
  },
  confirmPassword: {
    type: String,
    require: [true, 'Confirm password is a required field'],
    trim: true,
    validate: {
      // Works only when using CREATE and SAVE
      validator: function () {
        return this.password === this.confirmPassword;
      },
      message: 'Password and Confirm Password does not match.',
    },
  },
  passwordResetAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
});

module.exports = userSchema;
