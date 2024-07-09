const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const addNewBook = async (req, res) => {
  const data = await s3
    .putObject({
      Body: "aboba for test with server",
      Bucket: "elasticbeanstalk-eu-west-3-507450525930/books",
      Key: "test.txt",
    })
    .promise();
  res.status(200).json(data);
};
module.exports = addNewBook;
