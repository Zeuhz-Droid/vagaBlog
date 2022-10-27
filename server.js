const { default: mongoose } = require("mongoose");

require("dotenv").config();

const app = require("./app");

const DB = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"));

app.listen(process.env.PORT, () =>
  console.log(`Listening succesfully on PORT: ${process.env.PORT}`)
);
