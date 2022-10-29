const express = require('express');
const morgan = require('morgan');
const passport = require('passport');

const blogRouter = require('./routes/blogRoutes');
const authRouter = require('./routes/userRoutes');

const globalErrorHandler = require('./controller/errorController');

const app = express();
require('dotenv').config();

require('./utilities/authenticate-passport-jwt');

if ((process.env.NODE_ENV = 'development')) {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/users', authRouter);

app.use('*', (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl} on this server.`));
});
app.use(globalErrorHandler);

module.exports = app;
