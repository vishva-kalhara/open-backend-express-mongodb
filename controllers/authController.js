const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

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

// const updatePassword = () => {};

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // validate the email is not null
  if (!email) return next(new AppError('Please provide Email', 400));

  // Get the user account
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new AppError('There is no account associated with this Email.', 401),
    );

  // Generates reset token and persist data in db
  const token = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Sending Email
  try {
    sendEmail({
      toEmail: email,
      subject: 'Reset Password',
      content: `Here is your password reset token: ${token}`,
    });

    res.status(200).json({
      staus: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    return next(
      new AppError("Couldn't send the email! Please tyr again later.", 500),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Token is expired or not valid!', 400));

  // Persist data in the database
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetAt = Date.now();
  await user.save();

  createSendToken(user, 200, res);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, confirmPassword } = req.body;

  const userExist = await User.findById(req.user.id).select('+password');
  if (!userExist)
    return next(
      new AppError('There is no account associated with this account.', 404),
    );

  // Match currentPassword with the password in the db
  const isMatched = await isPasswordsMatch(currentPassword, userExist.password);
  if (!isMatched)
    return next(new AppError('Current Password is not matching', 401));

  // Reset Password
  userExist.password = password;
  userExist.confirmPassword = confirmPassword;
  await userExist.save();

  createSendToken(userExist, 200, res);
});
