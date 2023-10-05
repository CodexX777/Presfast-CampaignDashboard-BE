const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const uploadImageToS3 = async (file, fileName) => {
  const buffer = Buffer.from(file.buffer); // Convert the file buffer to a Buffer object
  return s3
    .putObject({
      Body: buffer,
      Bucket: process.env.CYCLIC_BUCKET_NAME,
      Key: fileName,
    })
    .promise();
};

module.exports = uploadImageToS3;
