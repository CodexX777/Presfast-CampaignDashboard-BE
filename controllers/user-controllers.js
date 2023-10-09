const pool = require("../utils/db");
const HttpError = require("../models/http-error");
const PresfastProducts = require("../models/PresfastProducts");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const HungryJackProducts = require("../models/HungryJacksProducts");
const Stores = require("../models/Stores");
const mongoose = require("mongoose");
const Campaigns = require("../models/Campaigns");

const getAllPresfastProducts = async (req, res, next) => {
  try {
    const products = await PresfastProducts.find();

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await Promise.all(
          product.prodImages.map(async (image, i) => {
            const params = {
              Bucket: process.env.CYCLIC_BUCKET_NAME,
              Key: image,
              Expires: 3600,
              ResponseContentDisposition: "inline",
            };

            const url = await s3.getSignedUrl("getObject", params);
            console.log("index name and url", i, image, url);
            return url;
          })
        );
        return { ...product._doc, prodImages: images };
      })
    );

    res.status(200).json({ products: productsWithImages });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Fetching products failed.", 500));
  }
};

const getAllHungryJackProducts = async (req, res, next) => {
  try {
    const products = await HungryJackProducts.find();

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await Promise.all(
          product.prodImages.map(async (image, i) => {
            const params = {
              Bucket: process.env.CYCLIC_BUCKET_NAME,
              Key: image,
              Expires: 3600,
              ResponseContentDisposition: "inline",
            };

            const url = await s3.getSignedUrl("getObject", params);
            console.log("index name and url", i, image, url);
            return url;
          })
        );

        return { ...product._doc, prodImages: images };
      })
    );

    res.status(200).json({ products: productsWithImages });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Fetching products failed.", 500));
  }
};

const getStoreTypeOptions = async (req, res, next) => {
  const { regionList } = req.body;

  try {
    const storeTypeOptions = await Promise.all(
      regionList.map(async (region) => {
        const newRegions = region.regions.map((reg) => {
          return reg.value;
        });
        console.log(newRegions);
        const options = await Stores.aggregate([
          {
            $match: {
              storeRegion: { $in: newRegions },
            },
          },
          {
            $group: {
              _id: "$keyNumber",
              storeTypes: { $addToSet: "$storeType" },
            },
          },
          {
            $project: {
              storeTypeOptions: "$storeTypes",
              _id: 0,
            },
          },
        ]);
        console.log("options", options);

        return {
          keyNumber: region.keyNumber,
          storeTypeOptions: options[0].storeTypeOptions,
        };
      })
    );

    res.status(200).json({ storeTypeOptions });
  } catch (error) {
    console.error(error);
    return next(new HttpError("Fetching store type options failed.", 500));
  }
};

const scheduleCampaign = async (req, res, next) => {
  const { campaignInfo, orderData } = req.body;

  const newOrderData = orderData.map((order) => {
    return {
      ...order,
      presfastItem: {
        _id: new mongoose.Types.ObjectId(order.presfastItem._id),
      },
      hjProduct: {
        _id: new mongoose.Types.ObjectId(order.hjProduct._id),
      },
    };
  });

  try {
    const newCampaign = new Campaigns({
      promotionName: campaignInfo.promotionName,
      projectLead: campaignInfo.projectLead,
      jobNumber: campaignInfo.jobNumber,
      dueDate: campaignInfo.dueDate,
      campaignLiveDate: campaignInfo.campaignLiveDate,
      orderData: newOrderData,
    });

    await newCampaign.save();

    res.status(201).json({ message: "Campaign scheduled successfully!" });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Scheduling campaign failed.", 500));
  }
};
const getSingleStoreData = async (req, res, next) => {
  const { id } = req.query;

  try {
    const storeData = await Stores.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    res.status(201).json({ data: { storeData } });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Fetching stores failed.", 500));
  }
};

const getRecentCampaignList = async (req, res, next) => {
  try {
    const campaignList = await Campaigns.aggregate([
      {
        $project: {
          promotionName: 1,
          projectLead: 1,
          jobNumber: 1,
          campaignLiveDate: 1,
          status: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          createdAt: -1, // Sorting by the 'createdAt' field in descending order (most recent first)
        },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(201).json({ campaignList });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, please try again later", 500)
    );
  }
};

const getAllCampaignList = async (req, res, next) => {
  try {
    const campaignList = await Campaigns.aggregate([
      {
        $project: {
          promotionName: 1,
          projectLead: 1,
          jobNumber: 1,
          campaignLiveDate: 1,
          status: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          createdAt: -1, // Sorting by the 'createdAt' field in descending order (most recent first)
        },
      },
    ]);

    res.status(201).json({ campaignList });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, please try again later", 500)
    );
  }
};
exports.getAllCampaignList = getAllCampaignList;
exports.getRecentCampaignList = getRecentCampaignList;
exports.getSingleStoreData = getSingleStoreData;
exports.scheduleCampaign = scheduleCampaign;
exports.getStoreTypeOptions = getStoreTypeOptions;
exports.getAllHungryJackProducts = getAllHungryJackProducts;
exports.getAllPresfastProducts = getAllPresfastProducts;
