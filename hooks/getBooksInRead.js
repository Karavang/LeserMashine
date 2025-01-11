const { Post } = require("../mongoDB");

const getBooksInRead = async (req, res) => {
  try {
    const filenames = req.user.pages.map((book) => book.filename);

    const books = await Post.find({
      filename: filenames,
    });

    res.status(200).json(books);
  } catch (err) {
    res.status(500).json(err);
  }
};
module.exports = getBooksInRead;
