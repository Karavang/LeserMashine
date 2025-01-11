const getBookInfoForMongo = require("../hooks/getBookInfoForMongo");
const s3 = require("../import3");
const { Post } = require("../mongoDB");

const getAllBooks = async (req, res) => {
  // const input = {
  //   Bucket: "elasticbeanstalk-eu-west-3-507450525930",
  // };

  try {
    //   const data = await s3
    //     .listObjectsV2({
    //       Bucket: input.Bucket,
    //       Prefix: "books/",
    //     })
    //     .promise();

    //   const books = [];

    //   for (const book of data.Contents) {
    //     const name = book.Key.split("/").pop();

    //     const bookInfo = await getBookInfoForMongo(name);

    //     const post = await Post.findOne({ filename: name });

    //     if (!post && typeof bookInfo === "object") {
    //       Post.create(bookInfo);
    //     }
    //     books.push(bookInfo);
    //   }
    const books = await Post.find();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

module.exports = getAllBooks;
