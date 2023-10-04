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
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new HttpError("Authentication failed.", 401));
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const result = await pool.query(
      "SELECT * FROM Users WHERE id=? AND email=?",
      [decodedToken.userId, decodedToken.email]
    );

    if (result[0][0]?.status !== "activated") {
      return next(new HttpError("User is not activated", 422));
    }

    if (result[0][0]?.role) {
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
