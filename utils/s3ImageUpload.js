const AWS = require("aws-sdk");

const s3 = new AWS.S3();

const uploadImageToS3 = async (file, fileName) => {
  return s3
    .putObject({
      Body: req.file.buffer,
      Bucket: process.env.CYCLIC_BUCKET_NAME,
      Key: fileName,
    })
    .promise();
};

module.exports = uploadImageToS3;