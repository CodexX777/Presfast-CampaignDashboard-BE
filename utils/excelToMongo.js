const Stores = require("../models/Stores");
const mongoose = require("mongoose");

const jsonToMongo = async (jsData) => {
  console.log("working");
//   const sess = await mongoose.startSession();
//   sess.startTransaction();
  console.log("total length", jsData.length);
  try {
    for (let i = 0; i < jsData.length; i++) {
      console.log(`working ${i}`);
      const store = new Stores({
        storeName: jsData[i].storeName,
        storeNumber: jsData[i].storeNumber,
        storeType: jsData[i].storeType,
        jacksCafe: jsData[i].jacksCafe ? jsData[i].jacksCafe : "No",
        storeAddress: jsData[i].storeAddress,
        storeCity: jsData[i].storeCity,
        storePostCode: jsData[i].storePostCode,
        storeRegion: jsData[i].storeRegion,
        storeCountry: jsData[i].storeCountry,
        storeLandmark: jsData[i].storeLandmark ? jsData[i].storeLandmark : "",
      });
      await store.save();
    }

    // await sess.commitTransaction();
    // sess.endSession();
    console.log("Completed");
  } catch (error) {
    console.log(error);
    // sess.abortTransaction();
  }
  console.log("Completed");
};

module.exports = jsonToMongo;
