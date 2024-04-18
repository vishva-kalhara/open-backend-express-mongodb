const handleValidationErrors = (error) => {
  const newError = error;
  newError.statusCode = 400;
  newError.status = 'fail';
  newError.message = Object.values(error.errors)[0].message;

  return newError;
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // console.error('Error 💥💥', err);
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
  let errorObj = err;

  errorObj.statusCode = err.statusCode || 500;
  errorObj.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(errorObj, res);
  else if (process.env.NODE_ENV === 'production') {
    if (errorObj.name === 'ValidationError') {
      errorObj = handleValidationErrors(errorObj);
    }
    sendErrorProd(errorObj, res);
  }
};
