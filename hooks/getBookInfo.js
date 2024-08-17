const s3 = require("../import3");
const getFileExtension = require("../getExt");
const parseEpub = require("../parsers/parserEpub");
const parseFb2 = require("../parsers/parsfb2");

const getBookInfo = async (name) => {
  if (name !== undefined) {
    try {
      const data = await s3
        .getObject({
          Bucket: "elasticbeanstalk-eu-west-3-507450525930/books",
          Key: name,
        })
        .promise();

      const ext = getFileExtension(name);

      if (ext === "epub") {
        return parseEpub(data, name);
      } else if (ext === "fb2") {
        return parseFb2(data, name);
      } else {
        return "it isn't epub or fb2";
      }
    } catch (error) {
      console.error("Error fetching file from S3: ", error);
      return null;
    }
  }
  return null;
};

module.exports = getBookInfo;
