const pool = require("../utils/db");
const HttpError = require("../models/http-error");
const PresfastProducts = require("../models/PresfastProducts");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const HungryJackProducts = require("../models/HungryJacksProducts");
const Stores = require("../models/Stores");
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
        console.log(newRegions)
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


// const getProduct = async (req, res, next) => {
//   const productId = req.params.pid;
//   try {
//     const product = await pool.query(
//       "SELECT * FROM Products WHERE product_id=?",
//       [productId]
//     );
//     if (product[0].length === 0) {
//       return next(new HttpError("Product not found.", 404));
//     }
//     res.status(200).json({ product: product[0][0] });
//   } catch (error) {
//     console.log(error);
//     return next(new HttpError("Fetching product failed.", 500));
//   }
// };

exports.getStoreTypeOptions=getStoreTypeOptions;
exports.getAllHungryJackProducts = getAllHungryJackProducts;
exports.getAllPresfastProducts = getAllPresfastProducts;
// exports.getProduct = getProduct;
