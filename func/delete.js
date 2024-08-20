const s3 = require("../import3");
const { Post } = require("../mongoDB");
const deleteOne = async (req, res) => {
  const name = req.params.filename;
  try {
    await s3
      .deleteObject({
        Bucket: "elasticbeanstalk-eu-west-3-507450525930/books",
        Key: name,
      })
      .promise();
    await Post.deleteOne({ filename: name });
    res.status(200).json(`Success! ${name} deleted from bucket`);
  } catch (error) {
    res.status(500).json(`Error:${error}`);
  }
};
module.exports = deleteOne;
