const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/userModel');

// used to extract user email and password in the req object from the bearer token
passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    },
    async (req, token, done) => {
      try {
        const currentUser = await User.findById(token.user._id);
        req.user = currentUser;
        done(null, req.user);
      } catch (err) {
        done(err);
      }
    }
  )
);

// collects the user info from the extraction Strategy and addes some info to it and saves it to the database and sends user info to auth controller
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
          username: req.body.username,
          email,
          password,
        });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// verifies user email and password before parsing them to the passport-authenticator handler
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
