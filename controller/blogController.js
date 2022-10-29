const Blog = require('../models/blogModel');
const catchAsync = require('../utilities/catchAsync');

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const { query: queryObj } = req;
  const excludedFields = ['page', 'order', 'limit'];
  excludedFields.forEach((field) => delete queryObj[field]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(lte|lt|gte|gt)\b/, (match) => `$${match}`);
  let query = Blog.find(JSON.parse(queryStr));
  //   console.log(query);

  //  PAGINATE
  if (req.query.page) {
    const page = req.query.page * 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
  }

  //  SEARCHING
  const ExpectedFields = ['author', 'title', 'tags'];
  const ExpectedFieldsArr = [];
  ExpectedFields.forEach((field) => {
    if (req.query[field]) ExpectedFieldsArr.push({ [field]: req.query[field] });
  });
  query = query.find(ExpectedFieldsArr && {});

  //   SORTING
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-read_count -reading_time +timestamp');
  }

  const blogs = await query;

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

exports.createBlog = catchAsync(async (req, res, next) => {
  if (!req.body.author) req.body.author = req.user._id;
  const newBlog = await Blog.create({ ...req.body, state: 'draft' });

  res.status(200).json({
    status: 'success',
    data: {
      blog: newBlog,
    },
  });
});

// When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1

exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).where({ state: 'published' });

  if (!blog) {
    return next(new Error('No published blog found with this id'));
  }

  await blog.save();

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    return next(new Error('No blog Found with this id'));
  }

  await blog.save();

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const { _id: userId } = req.user;
  const blog = await Blog.findById(req.params.id).populate({ path: 'author' });

  if (!blog) {
    return next(new Error('No blog Found with this id'));
  }

  const authorId = `${blog.author._id}`.split('"')[0];

  if (userId !== authorId) {
    return next(new Error('You do NOT have permission to perform this action'));
  }

  await Blog.deleteOne({ _id: req.params.id });

  res.status(200).json({
    status: 'success',
    message: `${blog.title}, Deleted!`,
    data: null,
  });
});

exports.getMyBlogs = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const userBlogs = await Blog.find({ author: _id });

  if (!userBlogs) next(new Error('User has no published blogs'));

  res.status(200).json({
    status: 'success',
    results: userBlogs.length,
    data: {
      blogs: userBlogs,
    },
  });
});

// implement forgot password and reset password

// The owner of the blog should be able to update the state of the blog to published
//  The owner of a blog should be able to edit the blog in draft or published state
//  The owner of the blog should be able to delete the blog in draft or published state
// The endpoint should be paginated
// It should be filterable by state
// Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
// The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated,
// default it to 20 blogs per page.
// It should also be searchable by author, title and tags.
// It should also be orderable by read_count, reading_time and timestamp
// When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1
// Come up with any algorithm for calculating the reading_time of the blog.
// Write tests for all endpoints
