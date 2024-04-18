const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  // Sign JWT
  const token = signToken(user.id);

  // Send JWT with a cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKEI_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  // Send Response with JWT
  res.status(statusCode).json({
    status: 'Success',
    JWT: token,
  });
};

exports.protect = catchAsync(async (req, res, next) => {});

exports.signUp = catchAsync(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const newUser = await User.create({
    email,
    password,
    confirmPassword,
  });

  // Removes password
  newUser.password = undefined;

  createSendToken(newUser, 200, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  // createSendToken(undefined, 200, res);
});

exports.RestrictTo = catchAsync(async (req, res, next) => {});

exports.forgotPassword = catchAsync(async (req, res, next) => {});

exports.resetPassword = catchAsync(async (req, res, next) => {});

exports.updateMyPassword = catchAsync(async (req, res, next) => {});
