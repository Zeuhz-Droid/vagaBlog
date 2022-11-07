const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const APIQueryFeatures = require('../utilities/APIQueryFeatures');

exports.getAllUsers = catchAsync(async (req, res) => {
  const features = new APIQueryFeatures(User.find(), req.query)
    .filter()
    .paginate();
  const users = await features.query;

  const totalPages = Math.ceil(users.length / 20);
  const currentPage = req.query.page || 1;

  res.status(200).json({
    status: 'success',
    results: users.length,
    totalPages,
    currentPage,
    data: {
      users,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new Error(`No user found with this Id`));

  user.role = req.body.role;

  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
