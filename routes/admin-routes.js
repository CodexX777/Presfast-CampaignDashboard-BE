const express = require("express");
const { check } = require("express-validator");
const adminController = require("../controllers/admin-controllers");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/add-presfast-product",
  upload.fields([{ name: "prodImages" }]),
  adminController.addPresfastProduct
);

router.post(
  "/add-hungryjack-product",
  upload.fields([{ name: "prodImages" }]),
  adminController.addHungryJackProduct
);

router.post("/add-store", adminController.addStore);
router.get("/get-stores", adminController.getAllStores);

router.post("/add-user", adminController.addUser);
router.put(
  "/update-user",
  [
    check("id").isString(),
    check("role").isString(),
    check("phoneNo").isString(),
  ],
  adminController.updateUser
);

router.put("/account-status-update", adminController.updateUserAccountStatus);

router.put(
  "/reset-password",
  [
    check("id").isString(),
    check("newPassword").isString(),
    check("confirmPassword").isString(),
  ],
  adminController.resetPassword
);

router.put(
  "/update-prod-price",
  [check("id").isNumeric(), check("unitPrice").isNumeric()],
  adminController.updateProductPrice
);

router.get("/get-users", adminController.getAllUsers);

module.exports = router;
