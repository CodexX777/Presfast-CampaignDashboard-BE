const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const dotenv = require("dotenv");
dotenv.config();
const pool = require("../utils/db");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new HttpError("Authentication failed.", 401));
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const existingUser = await Users.findOne({ email: decodedToken.email });
    if (!existingUser) {
      return next(new HttpError("User does not exist", 404));
    }
    if (existingUser.status === "Suspended") {
      return next(new HttpError("User is not activated", 422));
    }

    if (existingUser.role) {
      req.userData = { ...decodedToken };
      next();
    } else {
      return next(
        new HttpError("Authentication failed. Cannot find the user", 404)
      );
    }
  } catch (error) {
    return next(
      new HttpError("Something went wrong while Authenticating", 500)
    );
  }
};
