const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/userModel');

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    },
    async (req, token, done) => {
      try {
        req.user = token.user;
        done(null, token.user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.create({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email,
          password,
        });
        console.log(user);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

const authenticateUser = async (email, password, done) => {
  try {
    if (!email || !password) {
      return next(new Error('Please provide email and password'));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return done(null, false, { message: 'Incorrect Email or Password' });
    }

    return done(null, user, { message: 'Logged in Successfully' });
  } catch (error) {
    return done(error);
  }
};

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    authenticateUser
  )
);
