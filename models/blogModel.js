const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please give blog title.'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    maxlength: 140,
    trim: true,
  },
  tags: {
    type: Array,
    lowercase: true,
    trim: true,
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
    type: String,
    trim: true,
  },
  body: {
    type: String,
    required: [true, 'A blog must have a body.'],
    minlength: 20,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

// sends along DETAILS OF THE AUTHOR of a requested blog(s)
blogSchema.pre(/^find/, function (next) {
  this.populate({ path: 'author', select: 'username' });
  next();
});

// saves tags in lowercase
blogSchema.pre('save', function (next) {
  this.tags = this.tags.map((tag) => tag.toLowerCase());
  next();
});

// calculates reading_time for each blog created(saved)
blogSchema.pre('save', function (next) {
  const avgReadingTime = 150;
  const blogWords = this.body.split(' ');
  let totalNumWords = 0;
  blogWords.forEach(() => totalNumWords++);
  this.reading_time = `${Math.ceil(totalNumWords / avgReadingTime)} mins`;
  next();
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
