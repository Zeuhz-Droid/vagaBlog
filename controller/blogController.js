const Blog = require("../models/blogModel");
const catchAsync = require("../utilities/catchAsync");

exports.getAllBlogs = catchAsync(async (req, res, next) => {});

exports.createBlog = catchAsync(async (req, res, next) => {
  const newBlog = await Blog.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      blog: newBlog,
    },
  });
});
