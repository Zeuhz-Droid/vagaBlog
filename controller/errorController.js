const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new Error(message);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: 'fail',
    error: err,
    message: err.msg,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if ((process.env.NODE_ENV = 'development')) {
    sendErrorDev(err, res);
  }

  if (err.name == 'CastError') handleCastErrorDB(err);
  sendErrorProd(err, res);
};
