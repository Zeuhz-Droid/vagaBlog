const express = require('express');
const passport = require('passport');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/login', authController.logIn);
router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  authController.signUp
);

module.exports = router;
