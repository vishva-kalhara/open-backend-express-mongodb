const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

module.exports = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(
      new AppError(
        "You're not logged in! please log in to the application",
        401,
      ),
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const userExist = await User.findById(decoded.id);
  if (!userExist)
    return next(
      new AppError('The User associated wit this token is deleted.', 401),
    );

  const isChangedPassword = await userExist.isPasswordChanged(decoded.iat);
  if (isChangedPassword)
    return next(
      new AppError('User recently changed password! Please login again.', 401),
    );

  req.user = userExist;
  next();
});
