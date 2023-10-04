const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const HttpError = require("./models/http-error");
const checkAdmin = require("./middlewares/checkAdmin");
const mongoose = require("mongoose");
//const checkAuth = require("./middlewares/checkAuth");
dotenv.config();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(cors());

//All the routes come here
app.use("/api/auth", require("./routes/auth-routes"));
app.use("/api/admin", checkAdmin, require("./routes/admin-routes"));
app.use("/api/items", checkAdmin, require("./routes/item-routes"));
//Error handling middleware
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xvgrljc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to mongoDB");
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
