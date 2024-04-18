const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const isPasswordsMatch = async (plainPassword, hashedPassword) =>
  await bcrypt.compare(plainPassword, hashedPassword);

const createSendToken = (user, statusCode, res) => {
  // Sign JWT
  const token = signToken(user.id);

  // Send JWT with a cookie
  // const cookieOptions = {
  //   expires: new Date(
  //     Date.now() + process.env.JWT_COOKEI_EXPIRES_IN * 24 * 60 * 60 * 1000,
  //   ),
  //   httpOnly: true,
  // };
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  // res.cookie('token', token, cookieOptions);

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

  // Send Response
  createSendToken(newUser, 200, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Require email and Password
  if (!email || !password)
    return next(new AppError('Email and Password is required.', 400));

  // Get user with Password
  const user = await User.findOne({ email }).select('+password');
  if (!user)
    return next(
      new AppError('There is no an account associated with the email!', 401),
    );

  // Check whether the passwords match or not
  const isMatched = await isPasswordsMatch(password, user.password);
  if (!isMatched) return next(new AppError('Passwords Does not match!', 401));

  // remove password field from user
  user.password = undefined;

  // Send Response
  createSendToken(user, 200, res);
});

exports.RestrictTo = catchAsync(async (req, res, next) => {});

exports.forgotPassword = catchAsync(async (req, res, next) => {});

exports.resetPassword = catchAsync(async (req, res, next) => {});

exports.updateMyPassword = catchAsync(async (req, res, next) => {});
