const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  console.error('Error 💥💥', err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message || 'Something went wrong! Please try again later.',
    });
  }
};

module.exports = (err, req, res, next) => {
  const errorObj = err;

  errorObj.statusCode = err.statusCode || 500;
  errorObj.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(errorObj, res);
  else if (process.env.NODE_ENV === 'production') sendErrorProd(errorObj, res);
};
