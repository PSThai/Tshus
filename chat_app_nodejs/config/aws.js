const AWS = require('aws-sdk');
require("dotenv").config();

// Config AWS S#
const { S3_BUCKET_NAME, ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;
process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1";

// S#
const s3 = new AWS.S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
});

// Export
module.exports = { s3, S3_BUCKET_NAME };
