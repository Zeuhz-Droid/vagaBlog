const express = require('express');
const passport = require('passport');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

//  consumes request from users wanting to login
router.post('/login', authController.logIn);
router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  authController.signUp
);

//  consumes request from admin requesting for a list of users
router
  .route('/')
  .get(
    passport.authenticate('jwt', { session: false }),
    authController.restrictTo('admin'),
    userController.getAllUsers
  );

//  consumes request from admin requesting for a specific user
router
  .route('/:id')
  .post(
    passport.authenticate('jwt', { session: false }),
    authController.restrictTo('admin'),
    userController.updateUser
  );

module.exports = router;
