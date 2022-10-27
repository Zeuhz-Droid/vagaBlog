const express = require("express");
const blogRouter = require("./routes/blogRoutes");
const globalErrorHandler = require("./controller/errorController");

const app = express();

require("dotenv").config();

app.use(express.json({ extended: false }));

app.use("/api/v1/blogs", blogRouter);

app.use("*", (req, res, next) => {
  next(err);
});
app.use(globalErrorHandler);

module.exports = app;
