const s3 = require("../import3");

const getAllBooks = async (req, res) => {
  const input = {
    Bucket: "elasticbeanstalk-eu-west-3-507450525930",
  };

  const data = await s3
    .listObjectsV2({
      Bucket: input.Bucket,
      Prefix: "books/",
    })
    .promise();
  const books = data.Contents.map((book) => {
    return {
      key: book.Key,
      size: book.Size,
      lastModified: book.LastModified,
    };
  });
  res.status(200).json(books);
};

module.exports = getAllBooks;
