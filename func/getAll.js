const getBookInfo = require("../hooks/getBookInfo");
const s3 = require("../import3");

const getAllBooks = async (req, res) => {
  const input = {
    Bucket: "elasticbeanstalk-eu-west-3-507450525930",
  };

  try {
    const data = await s3
      .listObjectsV2({
        Bucket: input.Bucket,
        Prefix: "books/",
      })
      .promise();

    const books = [];

    for (const book of data.Contents) {
      const name = book.Key.split("/").pop();
      const bookInfo = await getBookInfo(name);
      console.log(bookInfo);

      books.push(bookInfo);
    }

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

module.exports = getAllBooks;
