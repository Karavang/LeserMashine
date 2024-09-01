const getBookInfo = require("../hooks/getBookInfo");
const { Post } = require("../mongoDB");

const mongoPost = async (req, res, next) => {
  const fileName = req.file.originalname;

  const bookData = await getBookInfo(fileName);
  await Post.create(bookData);

  req.bookData = bookData;
  next();
};

module.exports = mongoPost;
