const s3 = require("../import3");
const deleteOne = async (req, res) => {
  const name = req.params.filename;
  try {
    const process = await s3
      .deleteObject({
        Bucket: "elasticbeanstalk-eu-west-3-507450525930/books",
        Key: name,
      })
      .promise();
    res.status(200).json(`Success! ${name} deleted from bucket`);
  } catch (error) {
    res.status(500).json(`Error:${error}`);
  }
};
module.exports = deleteOne;
