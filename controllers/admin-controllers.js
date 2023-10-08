const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const HungryJackProducts = require("../models/HungryJacksProducts");
const PresfastProducts = require("../models/PresfastProducts");
const Users = require("../models/Users");
const Stores = require("../models/Stores");
const mongoose = require("mongoose");
const uploadImageToS3 = require("../utils/s3ImageUpload");
const { v4: uuidv4 } = require("uuid");

const addPresfastProduct = async (req, res, next) => {
  const {
    prodName,
    unitPrice,
    prodInitials,
    prodDesc,
    category,
    prodFinishedSize,
  } = req.body;
  console.log(req.body);
  console.log("req.files", typeof req.files, req.files);
  const prodImagesNameList = [];

  const simpleFunc = async (file, index) => {
    const fileName = uuidv4();
    const fileExtension = file.mimetype.split("/")[1];
    const fileFullName = `${fileName}.${fileExtension}`;
    const res = await uploadImageToS3(file, fileFullName);
    console.log(index, " - ", res);
    prodImagesNameList.push(fileFullName);
  };

  for (let i = 0; i < req.files["prodImages"].length; i++) {
    await simpleFunc(req.files["prodImages"][i], i);
  }

  try {
    const product = new PresfastProducts({
      prodName,
      unitPrice,
      prodDesc,
      prodInitials,
      prodImages: prodImagesNameList,
      prodCategory: category,
    });
    await product.save();

    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Adding product failed.", 500));
  }
};

const addUser = async (req, res, next) => {
  const { name, password, email, phone, role, status } = req.body;

  const existingUser = await Users.findOne({ email: email });
  if (existingUser) {
    return next(new HttpError("User already exists", 422));
  }
  const avatarBgOptions = ["purple", "danger", "info"];
  const randomIndex = Math.floor(Math.random() * avatarBgOptions.length);
  const avatarBg = avatarBgOptions[randomIndex];

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new Users({
      userName: name,
      password: hashedPassword,
      email,
      phoneNo: phone,
      role,
      avatarBg,
      status,
    });
    await user.save();

    res.status(201).json({ message: "User added successfully!" });
  } catch (error) {
    return next(new HttpError("Adding user failed.", 500));
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const userCount = await Users.countDocuments();

    const userList = await Users.aggregate([
      {
        $project: {
          _id: 1,
          userName: 1,
          email: 1,
          phoneNo: 1,
          role: 1,
          status: 1,
          avatarBg: 1,
        },
      },
    ]);
    res.status(201).json({ data: { userList, totalUsers: userCount } });
  } catch (error) {
    return next(new HttpError("Fetching users failed.", 500));
  }
};

const updateUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid user data passed", 400));
  }

  try {
    const { id, role, phoneNo } = req.body;

    const existingUser = await Users.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!existingUser) {
      return next(new HttpError("User does not exist", 404));
    }

    existingUser.role = role;
    existingUser.phoneNo = phoneNo;
    await existingUser.save();

    res.status(201).json({ message: "User role updated successfully!" });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Something went wrong while updating the user", 500)
    );
  }
};

const updateUserAccountStatus = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid user data passed", 400));
  }

  try {
    //Todo: check if the status value is valid
    const { id, status } = req.query;

    const existingUser = await Users.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!existingUser) {
      return next(new HttpError("User does not exist", 404));
    }

    existingUser.status = status;
    await existingUser.save();
    res
      .status(201)
      .json({ message: "User account status updated successfully!" });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError(
        "Something went wrong while updating the user account status",
        500
      )
    );
  }
};

const resetPassword = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid user data passed", 400));
  }

  try {
    const { id, newPassword, confirmPassword } = req.body;
    const existingUser = await Users.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!existingUser) {
      res.status(201).json({ message: "Password reset successfully!" });
    }
    if (newPassword !== confirmPassword) {
      return next(new HttpError("Passwords do not match", 400));
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    existingUser.password = hashedPassword;
    await existingUser.save();
    res.status(201).json({ message: "Password reset successfully!" });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Something went wrong while resetting the password", 500)
    );
  }
};

const updateProductPrice = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid user data passed", 400));
  }

  try {
    const { id, unitPrice } = req.body;
    const existingProduct = await PresfastProducts.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!existingProduct) {
      return next(new HttpError("Product does not exist", 404));
    }
    existingProduct.unitPrice = unitPrice;
    await existingProduct.save();
    res.status(201).json({ message: "Product price updated successfully!" });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError(
        "Something went wrong while updating the product price",
        500
      )
    );
  }
};

const addHungryJackProduct = async (req, res, next) => {
  const { prodName, prodDesc, prodCategory } = req.body;
  console.log(req.body);
  console.log("req.files", typeof req.files, req.files);
  const prodImagesNameList = [];

  const simpleFunc = async (file, index) => {
    const fileName = uuidv4();
    const fileExtension = file.mimetype.split("/")[1];
    const fileFullName = `${fileName}.${fileExtension}`;
    const res = await uploadImageToS3(file, fileFullName);
    console.log(index, " - ", res);
    prodImagesNameList.push(fileFullName);
  };

  for (let i = 0; i < req.files["prodImages"].length; i++) {
    await simpleFunc(req.files["prodImages"][i], i);
  }

  try {
    const product = new HungryJackProducts({
      prodName,
      prodDesc,
      prodImages: prodImagesNameList,
      prodCategory,
    });
    await product.save();

    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Adding product failed.", 500));
  }
};

const addStore = async (req, res, next) => {
  const {
    storeName,
    storeNumber,
    storeType,
    jacksCafe,
    storeAddress,
    storeCity,
    storePostCode,
    storeRegion,
    storeLandmark,
  } = req.body;

  try {
    const store = new Stores({
      storeName,
      storeNumber,
      storeType,
      jacksCafe,
      storeAddress,
      storeCity,
      storePostCode,
      storeRegion,
      storeLandmark: storeLandmark || "",
    });
    await store.save();

    res.status(201).json({ message: "Store added successfully!" });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Adding store failed.", 500));
  }
};

const getAllStores = async (req, res, next) => {
  try {
    const storeCount = await Stores.countDocuments();

    const storeData = await Stores.aggregate([
      {
        $project: {
          _id: 1,
          storeName: 1,
          storeNumber: 1,
          storeType: 1,
          storeRegion: 1,
        },
      },
    ]);

    res.status(201).json({ data: { storeData, storeCount } });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Fetching stores failed.", 500));
  }
};

exports.addStore = addStore;
exports.getAllStores = getAllStores;
exports.addHungryJackProduct = addHungryJackProduct;
exports.resetPassword = resetPassword;
exports.updateUserAccountStatus = updateUserAccountStatus;
exports.updateUser = updateUser;
exports.addPresfastProduct = addPresfastProduct;
exports.addUser = addUser;
exports.getAllUsers = getAllUsers;
exports.updateProductPrice = updateProductPrice;
