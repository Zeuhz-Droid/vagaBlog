const express = require('express');
const passport = require('passport');
const blogController = require('../controller/blogController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(blogController.getAllBlogs)
  .post(
    passport.authenticate('jwt', { session: false }),
    authController.restrictTo('user'),
    blogController.createBlog
  );

router
  .route('/myBlogs')
  .get(
    passport.authenticate('jwt', { session: false }),
    blogController.getMyBlogs
  );

router
  .route('/myBlogs/:id')
  .patch(
    passport.authenticate('jwt', { session: false }),
    authController.verifyCurrentUserAction,
    blogController.updateMyBlog
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    authController.verifyCurrentUserAction,
    blogController.deleteMyBlog
  );

router
  .route('/:id')
  .get(blogController.getBlog)
  .delete(
    passport.authenticate('jwt', { session: false }),
    authController.restrictTo('admin'),
    blogController.deleteBlog
  );

module.exports = router;
