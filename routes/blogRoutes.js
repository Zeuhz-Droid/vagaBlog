const express = require('express');
const passport = require('passport');
const blogController = require('../controller/blogController');
const authController = require('../controller/authController');

const router = express.Router();

// consumes request to the homepage
router
  .route('/')
  .get(blogController.getAllBlogs)
  .post(
    passport.authenticate('jwt', { session: false }),
    authController.restrictTo('user'),
    blogController.createBlog
  );

// consumes requests for all personal blogs
router
  .route('/myBlogs')
  .get(
    passport.authenticate('jwt', { session: false }),
    blogController.getMyBlogs
  );

//  consumes requests for specific personal blogs
router
  .route('/myBlogs/:id')
  .patch(
    passport.authenticate('jwt', { session: false }),
    blogController.updateMyBlog
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    blogController.deleteMyBlog
  );

// consumes requests for specific blogs
router
  .route('/:id')
  .get(blogController.getBlog)
  .delete(
    passport.authenticate('jwt', { session: false }),
    authController.restrictTo('admin'),
    blogController.deleteBlog
  );

module.exports = router;
