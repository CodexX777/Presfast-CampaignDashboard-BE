const mongoose = require("mongoose");
const { authorityValues } = require("../models/authority");
const Schema = mongoose.Schema;

//Todo add a permission array to store all the permissions
const userSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarBg: { type: String, required: true },
  role: {
    type: String,
    enum: authorityValues,
  },
  phoneNo: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model("Users", userSchema);
