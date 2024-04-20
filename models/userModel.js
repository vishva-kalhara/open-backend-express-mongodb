const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    required: [true, 'Password is a required field'],
    // minlength: 8,
    validate: {
      validator: function () {
        return this.password.length >= 8;
      },
      message: 'Password Shoud be longer than 8 characters.',
    },
    trim: true,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm password is a required field'],
    trim: true,
    validate: {
      // Works only when using CREATE and SAVE
      validator: function () {
        return this.password === this.confirmPassword;
      },
      message: 'Password and Confirm Password does not match.',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
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

// Hash Password and remove confirm Password
userSchema.pre('save', async function (next) {
  // Document saved without modifying password
  if (!this.isModified('password')) next();

  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;

  next();
});

// Add passwordResetAt

userSchema.methods.isPasswordChanged = function (JWTTimeStamp) {
  if (this.passwordResetAt) {
    const changedTimeStamp = parseInt(
      this.passwordResetAt.getTime() / 1000,
      10,
    );

    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
