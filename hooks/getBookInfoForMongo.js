const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const getFileExtension = require("../getExt");
const parseEpub = require("../parsers/parserEpub");
const parseFb2 = require("../parsers/parsfb2");

const getBookInfo = async (name) => {
  const client = new S3Client({ region: "eu-west-3" });
  if (name !== undefined) {
    try {
      console.log(name);
      const data = await client.send(
        new GetObjectCommand({
          Bucket: "elasticbeanstalk-eu-west-3-507450525930",
          Key: `books/${name}`,
        }),
      );

      const ext = getFileExtension(name);

      if (ext === "epub") {
        return parseEpub(await data.Body.transformToByteArray(), name);
      } else if (ext === "fb2") {
        return parseFb2(await data.Body.transformToString(), name);
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
