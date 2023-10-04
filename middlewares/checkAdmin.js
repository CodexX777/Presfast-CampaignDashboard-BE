const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const dotenv = require("dotenv");
dotenv.config();
const pool = require("../utils/db");
const Users = require("../models/Users");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("token", token);
    if (!token) {
      return next(
        new HttpError("Authentication failed. No such user found", 404)
      );
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    let userData = {
      userId: decodedToken.userId,
      email: decodedToken.email,
      role: decodedToken.role,
    };
    console.log("userData", userData);
    const result = await Users.findOne({
      _id: new mongoose.Types.ObjectId(userData.userId),
    });
    if (!result) {
      return next(new HttpError("User not found", 404));
    }

    if (result.status === "deactivated") {
      return next(new HttpError("User is not activated", 422));
    }
    console.log("Result",result.role)
    if (result.role === "Admin") {
      console.log("result ", result);
      userData.isAdmin = true;
    } else {
      return next(
        new HttpError("Authorization failed. You are not Admin!", 401)
      );
    }

    req.userData = { ...userData };
    console.log("finish admin");
    next();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Authentication failed.", 401));
  }
};
