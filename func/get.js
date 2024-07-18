const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const getAllBooks = async (req, res) => {
  const input = {
    Bucket: "elasticbeanstalk-eu-west-3-507450525930",
    Key: "test.txt",
  };
  const name = req.body.filename;
  const data = await s3
    .getObject({
      Bucket: input.Bucket,
      Key: name,
    })
    .promise();
  res.send(data.Body);
};
module.exports = getAllBooks;
