const mongoose = require("mongoose");
const { authorityValues } = require("../models/authority");
const Schema = mongoose.Schema;

//Todo add a permission array to store all the permissions
const campaignSchema = new Schema({
  //campaignInfo
  promotionName: { type: String, required: true },
  projectLead: { type: String, required: true },
  jobNumber: { type: String, required: true, unique: true },
  dueDate: { type: String, required: true },
  campaignLiveDate: { type: String, required: true },
  //material Data
  orderData: [
    {
      keyNumber: { type: String, required: true },
      extraQuantityPerStore: { type: String, required: true },
      quantityPerStore: { type: String, required: true },
      presfastItem: {
        //ref to presfast item
        _id: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "PresfastProducts",
        },
      },
      hjProduct: {
        //ref to hj product
        _id: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "HungryJackProducts",
        },
      },
      selectedRegions: [{ type: String, required: true }],
      selectedStoreTypes: [{ type: String, required: true }],
      artWorkImage: { type: String, required: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  status: { type: String, required: false, default: "Pending" },
});

module.exports = mongoose.model("Campaigns", campaignSchema);
