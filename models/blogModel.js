const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please give blog title.'],
    unique: true,
  },
  description: {
    type: String,
    minlength: 50,
    maxlength: 140,
  },
  tags: {
    type: String,
    minlength: 1,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  state: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  read_count: {
    type: Number,
    default: 0,
  },
  reading_time: {
    type: Date,
    default: Date.now().getTime,
  },
  body: {
    type: String,
    required: [true, 'A blog must have a body.'],
    minlength: 50,
    maxlength: 200,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

blogSchema.pre('save', function (next) {
  this.read_count = this.read_count + 1;
  next();
});

blogSchema.pre(/\b(find)\b/, function (next) {
  this.find({ state: 'published' });
  next();
});

blogSchema.pre(/^find/, function (next) {
  this.populate({ path: 'author' });
  next();
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
