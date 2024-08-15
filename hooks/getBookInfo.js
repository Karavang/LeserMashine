const epubParser = require("epub-parser");
const s3 = require("../import3");
const getFileExtension = require("../getExt");
const convertArrayToObject = require("./forParseEpub");

const getBookInfo = async (name) => {
  console.log(name);
  if (name !== undefined) {
    const data = await s3
      .getObject({
        Bucket: "elasticbeanstalk-eu-west-3-507450525930/books",
        Key: name,
      })
      .promise();

    const ext = getFileExtension(name);
    console.log(ext);

    if (ext === "epub") {
      return new Promise((resolve, reject) => {
        epubParser.open(data.Body, function (err, epubData) {
          if (err) {
            reject(err);
          } else {
            const metaData = convertArrayToObject(epubData.easy.simpleMeta);

            const bookInfo = {
              title: metaData.dc_title,
              author: metaData.dc_creator,
              date: metaData.dc_date,
              lang: metaData.dc_language,
              desc: metaData.dc_description,
              filename: name,
            };

            resolve(bookInfo);
          }
        });
      });
    } else {
      return "it isn't epub";
    }
  }
  return null;
};

module.exports = getBookInfo;
