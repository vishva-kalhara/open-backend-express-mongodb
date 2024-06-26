const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const authRouter = require('./routes/authRoutes');

const app = express();

// Adding HTTP Headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try agin in an hour!',
});
app.use('/api', limiter);

// Body Parser limiting the size to 10kb
app.use(express.json({ max: '10kb' }));

// Data sanitization against NoSql Injection
app.use(mongoSanitize());

// Data sanitization against Cross Side Scripts
app.use(xss());

// Preventing parameter polution
app.use(
  hpp({
    // whitelist: ['']
  }),
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Routing
app.use('/api/v1/auth', authRouter);

// 404 Error route
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

// Error handleing middleware
app.use(globalErrorHandler);

module.exports = app;
