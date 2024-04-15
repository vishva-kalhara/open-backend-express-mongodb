const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

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

// Body Parser
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

// 404 Error handling route
// app.all('*', app)

module.exports = app;
