const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createSendToken = (user, statusCode, res) => {
  const body = { _id: user._id, email: user.email };

  const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

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
  res.status(201).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
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
