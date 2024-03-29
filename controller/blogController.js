const Blog = require('../models/blogModel');
const catchAsync = require('../utilities/catchAsync');
const APIQueryFeatures = require('../utilities/APIQueryFeatures');

// increase count by one
const increaseCount = (count) => {
  return ++count;
};

// extracts id off an incoming request param
const extractId = (id) => `${id}`.split('"')[0];

const verifyCurrentUserAction = catchAsync(async (req, res, next) => {
  const userBlog = await Blog.findById(req.params.id);

  if (!userBlog) {
    return next(new Error('No blog Found with this id'));
  }

  const userId = extractId(req.user._id);
  const authorId = extractId(userBlog.author?._id);

  if (userId !== authorId) {
    return next(new Error('You do NOT have permission to perform this action'));
  }

  return userBlog;
});

// fetches all blogs in the database, also helps filter, sort and paginate requests
exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const features = new APIQueryFeatures(
    Blog.find({ state: 'published' }),
    req.query
  )
    .filter('page', 'sort', 'limit')
    .search('title', 'tags', 'author')
    .sort()
    .paginate();

  let blogs = await features.query;

  const blogsPerPage = req.query.limit || 20;

  const featuresLength = new APIQueryFeatures(
    Blog.find({ state: 'published' }),
    req.query
  )
    .search('title', 'tags', 'author')
    .getDocumentAmount();

  const totalBlogsRequested = await featuresLength.docsLength;

  const totalPages = Math.ceil(totalBlogsRequested / blogsPerPage);
  const currentPage = Number(req.query.page) || 1;

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    totalPages,
    currentPage,
    data: {
      blogs,
    },
  });
});

//  creates a blog for an authenticated user
exports.createBlog = catchAsync(async (req, res, next) => {
  if (!req.body.author) req.body.author = req.user._id;

  const newBlog = await Blog.create({ ...req.body, state: 'draft' });

  res.status(201).json({
    status: 'success',
    data: {
      blog: newBlog,
    },
  });
});

// fetches a single blog for a authenticated user
exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).where({ state: 'published' });

  if (!blog) {
    return next(new Error('No published blog found with this id'));
  }

  blog.read_count = increaseCount(blog.read_count);

  await blog.save();

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

//  deletes a blog for an authenticated user
exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id).where({
    state: 'published',
  });

  if (!blog) {
    return next(new Error('No blog Found with this id'));
  }

  res.status(204).json({
    status: 'success',
    message: `${blog.title}, Deleted!`,
    data: null,
  });
});

// gets personal blogs for a specific authorised user
exports.getMyBlogs = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const features = new APIQueryFeatures(
    Blog.find({
      author: _id,
    }),
    req.query
  )
    .search('state')
    .paginate();

  const userBlogs = await features.query;

  if (!userBlogs) next(new Error('You have no published blogs'));

  const userBlogsSize = req.query.limit || 20;

  const featuresLength = new APIQueryFeatures(
    Blog.find({
      author: _id,
    }),
    req.query
  )
    .search('state')
    .getDocumentAmount();

  const userBlogsRequested = await featuresLength.docsLength;

  const totalPages = Math.ceil(userBlogsRequested / userBlogsSize);
  const currentPage = Number(req.query.page) || 1;

  res.status(200).json({
    status: 'success',
    results: userBlogs.length,
    totalPages,
    currentPage,
    data: {
      blogs: userBlogs,
    },
  });
});

//  updates blog of a specific authorised user
exports.updateMyBlog = catchAsync(async (req, res, next) => {
  const userBlog = await verifyCurrentUserAction(req, res, next);
  if (
    req.body.state &&
    req.body.state !== 'published' &&
    userBlog.state !== 'draft'
  ) {
    return next(
      new Error(
        `You already published this blog, you can't revert this action but you can edit or delete it`
      )
    );
  }

  userBlog.state = req.body.state;
  await userBlog.save();

  res.status(200).json({
    status: 'success',
    data: {
      blog: userBlog,
    },
  });
});

//  deletes personal blog of an authorised user
exports.deleteMyBlog = catchAsync(async (req, res, next) => {
  const userBlog = await verifyCurrentUserAction(req, res, next);
  if (userBlog) await Blog.deleteOne({ _id: req.params.id });

  res.status(204).json({
    status: 'success',
    message: `${userBlog.title}, Deleted!`,
    data: null,
  });
});
