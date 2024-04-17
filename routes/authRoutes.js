const express = require('express');
const authContoller = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/logIn', authContoller.logIn);
authRouter.post('/signUp', authContoller.signUp);
authRouter.post('/forgotPassword', authContoller.forgotPassword);
authRouter.patch('/resetPassword', authContoller.resetPassword);
authRouter.patch(
  '/updateMyPassword',
  authContoller.protect,
  authContoller.updateMyPassword,
);

module.exports = authRouter;
