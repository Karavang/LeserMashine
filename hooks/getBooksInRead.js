const { Post } = require("../mongoDB");

const getBooksInRead = async (req, res) => {
  try {
    console.log(req.user);
    const filenames = req.user.pages.map((book) => book.filename);
    console.log(filenames);
    const books = await Post.find({
      filename: filenames,
    });
    console.log(books);
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json(err);
  }
};
module.exports = getBooksInRead;
