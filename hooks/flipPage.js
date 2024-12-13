const { User } = require("../mongoDB.js");

const flipPage = async (req, res) => {
  const username = req.user._id;

  const { filename, page } = req.body;

  const userData = await User.findOne({ _id: username });

  if (userData.pages.find((item) => item.filename === filename)) {
    const index = userData.pages.findIndex(
      (item) => item.filename === filename,
    );

    userData.pages.splice(index, 1);
    userData.pages.push({ filename: filename, page: page });
    await User.findOneAndUpdate({ _id: username }, { pages: userData.pages });
    res.status(200).send("page updated");
  } else {
    userData.pages.push({ filename: filename, page: page });
    await User.findOneAndUpdate({ _id: username }, { pages: userData.pages });
    res.status(200).send("first page created");
  }
};

module.exports = flipPage;
