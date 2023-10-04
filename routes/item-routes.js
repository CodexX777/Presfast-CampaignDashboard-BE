const express = require("express");
const userController = require("../controllers/user-controllers");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router();

router.get("/all-products", userController.getAllPresfastProducts);
router.get("/product/:pid", userController.getProduct);

module.exports = router;
