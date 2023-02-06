const express = require('express');
const morgan = require('morgan');
const logger = require('./logger/logger');
const httpLogger = require('./logger/httpLogger');
const rateLimit = require('express-rate-limit');

const blogRouter = require('./routes/blogRoutes');
const userRouter = require('./routes/userRoutes');

const globalErrorHandler = require('./controller/errorController');

require('./database')();

const app = express();

require('dotenv').config();
require('./utilities/authenticate-passport-jwt');

// this handles uncaught Exceptions in our codes like bad codes etc
process.on('uncaughtException', (err) => {
  logger.error('UNHANDLED EXCEPTION! 💥 Shutting Down');
  process.exit(1);
});

// this allows us get data on every request made to the database
if ((process.env.NODE_ENV = 'development')) {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour.',
});

app.use(limiter);

app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/users', userRouter);

app.use('*', (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl} on this server.`));
});
app.use(globalErrorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  logger.info(`Listening succesfully on PORT: ${process.env.PORT}`)
);

// this handles uncaught rejections in our codes like un caught async functions
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION!  💥 Shutting Down (${err.statusCode})`);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
