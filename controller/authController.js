const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Blog = require('../models/blogModel');
const catchAsync = require('../utilities/catchAsync');

const extractId = (id) => `${id}`.split('"')[0];

const createSendToken = (user, statusCode, res) => {
  const body = { _id: user._id, email: user.email };

  const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  //  remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.logIn = async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) return next(new Error('Username or Password is Incorrect'));

      req.login(user, { session: false }, async (err) => {
        if (err) return next(err);

        createSendToken(user, 201, res);
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

exports.signUp = async (req, res, next) => {
  createSendToken(req.user, 201, res);
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Error(
          `You don't have permission to perform this operation. ${
            req.method === 'DELETE'
              ? `Try using this route ${req.protocol}://${req.get(
                  'host'
                )}/api/v1/blogs/myBlogs/${req.params.id}`
              : ''
          }`
        )
      );
    }
    next();
  };

exports.verifyCurrentUserAction = catchAsync(async (req, res, next) => {
  const userBlog = await Blog.findById(req.params.id);

  if (!userBlog) {
    return next(new Error('No blog Found with this id'));
  }

  const userId = extractId(req.user._id);
  const authorId = extractId(userBlog.author?._id);

  if (userId !== authorId) {
    return next(new Error('You do NOT have permission to perform this action'));
  }

  req.blog = userBlog;

  next();
});
