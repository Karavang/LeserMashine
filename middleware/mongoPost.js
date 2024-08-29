const getBookInfo = require("../hooks/getBookInfo");
const { Post } = require("../mongoDB");

const mongoPost = async (req, res, next) => {
  const fileName = req.file.originalname;
  console.log("Uploaded file name:", fileName);

  const bookData = await getBookInfo(fileName);
  await Post.create(bookData);

  console.log(bookData);
  req.bookData = bookData;
  next();
};

module.exports = mongoPost;
