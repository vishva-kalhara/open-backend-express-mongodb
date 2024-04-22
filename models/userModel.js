const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;

  next();
});

// Add passwordResetAt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordResetAt = Date.now() - 1000;
  next();
});

// Remove diactived accounts
userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

// Checks whether the password is changed after the JWT is issued or not
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

// Generates the reset token and expiration date
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(6).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
