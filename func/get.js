const AWS = require("aws-sdk");
const s3 = require("../import3");
const getFileExtension = require("../getExt");

const getBook = async (req, res) => {
  try {
    const name = req.params.filename;

    const data = await s3
      .getObject({
        Bucket: "elasticbeanstalk-eu-west-3-507450525930/books",
        Key: name,
      })
      .promise();

    const ext = getFileExtension(name);

    res.send({ data, ext });
  } catch (error) {
    if (error.code === "NoSuchKey") {
      res.status(404).send("File not found.");
    } else {
      console.error("Error fetching the book:", error);
      res.status(500).send("Error fetching the book.");
    }
  }
};

module.exports = getBook;
