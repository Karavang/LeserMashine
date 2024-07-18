const s3 = require("../import3");

const getBook = async (req, res) => {
  const input = {
    Bucket: "elasticbeanstalk-eu-west-3-507450525930",
    Key: "test.txt",
  };
  const name = req.params.filename;
  const data = await s3
    .getObject({
      Bucket: input.Bucket,
      Prefix: "books/",
      Key: name,
    })
    .promise();
  res.send(data.Body);
};
module.exports = getBook;
