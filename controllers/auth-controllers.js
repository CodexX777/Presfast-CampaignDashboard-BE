const bcrypt = require("bcryptjs");
const pool = require("../utils/db");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Users = require("../models/Users");
dotenv.config();

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { email, password } = req.body;
  console.log(email, password);
  let existingUser;
  try {
    existingUser = await Users.findOne({ email: email });
    console.log("existingUser", existingUser);
    if (!existingUser) {
      return next(new HttpError("User does not exist", 404));
    }
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      const error = new HttpError("Invalid credentials", 401);
      return next(error);
    }
    if (existingUser.status === "deactivated") {
      return next(
        new HttpError(
          "User account is deactivated, please contact the admin",
          401
        )
      );
    }

    const token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      userId: existingUser.id,
      token,
      role: existingUser.role,
      userName: existingUser.userName,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }
};

exports.login = login;
