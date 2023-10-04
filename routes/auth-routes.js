const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/auth-controllers");
const router = express.Router();

router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  authController.login
);

module.exports = router;
