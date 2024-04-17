const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {};

const createSendToken = (user, statusCode, res) => {
  res.status(statusCode).json({
    status: 'Success',
    data: user,
  });
};

exports.protect = catchAsync(async (req, res, next) => {});

exports.signUp = catchAsync(async (req, res, next) => {});

exports.logIn = catchAsync(async (req, res, next) => {
  createSendToken(undefined, 200, res);
});

exports.RestrictTo = catchAsync(async (req, res, next) => {});

exports.forgotPassword = catchAsync(async (req, res, next) => {});

exports.resetPassword = catchAsync(async (req, res, next) => {});

exports.updateMyPassword = catchAsync(async (req, res, next) => {});
