const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
