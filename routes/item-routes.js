const express = require("express");
const userController = require("../controllers/user-controllers");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router();

router.get("/all-presfast-products", userController.getAllPresfastProducts);
// router.get("/product/:pid", userController.getProduct);
router.get("/all-hungryjack-products", userController.getAllHungryJackProducts);
router.post("/get-store-type-options", userController.getStoreTypeOptions);
router.get("/store-data", userController.getSingleStoreData);
router.post("/schedule-campaign", userController.scheduleCampaign);
router.get("/get-recent-campaign-list", userController.getRecentCampaignList);
router.get("/get-campaign-list", userController.getAllCampaignList);
router.get("/getCampaign", userController.getCampaignData);
module.exports = router;
