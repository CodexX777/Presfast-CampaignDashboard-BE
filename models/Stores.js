const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
  },
  storeNumber: {
    type: String,
    required: true,
  },
  storeType: {
    type: String,
    required: false,
  },
  jacksCafe: {
    type: String,
    required: true,
  },
  storeAddress: {
    type: String,
    required: true,
  },
  storeCity: {
    type: String,
    required: true,
  },
  storePostCode: {
    type: String,
    required: true,
  },
  storeRegion: {
    type: String,
    required: true,
  },
  storeLandmark: {
    type: String,
    required: false,
  },
});

const Store = mongoose.model("Stores", storeSchema);

module.exports = Store;
