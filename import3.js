const { S3 } = require("@aws-sdk/client-s3");

const s3 = new S3();
module.exports = s3;
