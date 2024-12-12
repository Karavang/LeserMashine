const { User } = require("../mongoDB.js");

const flipPage = async (req, res) => {
  console.log(req.body);
  const { username, filename, page } = req.body;

  const userData = await User.findOne({ _id: username });
  console.log(userData);
  if (userData.pages.length !== 0) {
    console.log(333);
    console.log(userData.pages.find((item) => item.filename === filename));
    if (userData.pages.find((item) => item.filename === filename)) {
      const index = userData.pages.findIndex(
        (item) => item.filename === filename,
      );
      console.log(index);
      userData.pages.splice(index, 1);
      userData.pages.push({ filename: filename, page: page });
      await User.findOneAndUpdate({ _id: username }, { pages: userData.pages });
      res.status(200).send("page updated");
    } else {
      console.log(2);
    }
  } else {
    console.log(userData);

    userData.pages.push({ filename: filename, page: page });
    console.log(`newPages:${userData.pages}`);
    await User.findOneAndUpdate({ _id: username }, { pages: userData.pages });
    res.status(200).send("first page created");
  }
};

module.exports = flipPage;
