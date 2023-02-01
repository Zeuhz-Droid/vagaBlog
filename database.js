const mongoose = require('mongoose');

require('dotenv').config();

const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const connectDatabase = () =>
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection successful'))
    .catch((err) => console.log(`Connection error. Error: ${err}`));

module.exports = connectDatabase;
