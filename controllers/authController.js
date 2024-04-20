const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

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

// exports.protect = catchAsync(async (req, res, next) => {
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token)
//     return next(
//       new AppError(
//         "You're not logged in! please log in to the application",
//         401,
//       ),
//     );

//   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

//   const userExist = await User.findById(decoded.id);
//   if (!userExist)
//     return next(
//       new AppError('The User associated wit this token is deleted.', 401),
//     );

//   const isChangedPassword = await userExist.isPasswordChanged(decoded.iat);
//   if (isChangedPassword)
//     return next(
//       new AppError('User recently changed password! Please login again.', 401),
//     );
//   console.log(userExist.id);

//   req.user = userExist;
//   next();
// });

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

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  res.status(200).json({
    user: req.user,
  });
});
