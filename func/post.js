const getBookInfo = require("../hooks/getBookInfo");
const { Post } = require("../mongoDB");

const addNewBook = async (req, res) => {
  if (req.file) {
    const bookData = await getBookInfo(req.file.originalname);
    await Post.create(bookData);

    res.status(200).json("Success! Location: " + req.file.location);
  } else {
    res.status(500).json(`Error`);
  }
};
module.exports = addNewBook;
