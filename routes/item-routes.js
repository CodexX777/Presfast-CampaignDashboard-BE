const express = require("express");
const userController = require("../controllers/user-controllers");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router();

router.get("/all-presfast-products", userController.getAllPresfastProducts);
// router.get("/product/:pid", userController.getProduct);
router.get("/all-hungryjack-products", userController.getAllHungryJackProducts);
module.exports = router;
