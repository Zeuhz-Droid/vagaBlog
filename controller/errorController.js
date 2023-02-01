// handles cast error, error from our mongoose library (defined schema validators)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new Error(message);
};

//  sends this error if working in the development environment
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: 'fail',
    error: err,
    message: err.msg,
    stack: err.stack,
  });
};

//  sends this error if working in the production environment
const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

//  exports the handler
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if ((process.env.NODE_ENV = 'development')) {
    sendErrorDev(err, res);
  }

  if (err.name == 'CastError') handleCastErrorDB(err);
  sendErrorProd(err, res);
};
