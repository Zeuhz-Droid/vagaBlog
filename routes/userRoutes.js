const express = require('express');
const passport = require('passport');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router.post('/login', authController.logIn);
router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  authController.signUp
);

router
  .route('/')
  .get(
    passport.authenticate('jwt', { session: false }),
    authController.restrictTo('admin'),
    userController.getAllUsers
  );

router
  .route('/:id')
  .post(
    passport.authenticate('jwt', { session: false }),
    authController.restrictTo('admin'),
    userController.updateUser
  );

module.exports = router;
