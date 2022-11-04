const { default: mongoose } = require('mongoose');

require('dotenv').config();

const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const server = () =>
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection successful'));

module.exports = server;
