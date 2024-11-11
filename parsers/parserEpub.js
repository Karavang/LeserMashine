const epubParser = require("epub-parser");
const convertArrayToObject = require("../hooks/forParseEpub");

const parseEpub = async (data, name) => {
  const jsonString = Buffer.from(data).toString("utf8");

  const parsedData = JSON.parse(jsonString);
  console.log(parsedData);
  return new Promise((resolve, reject) => {
    epubParser.open(parsedData, function (err, epubData) {
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
};

module.exports = parseEpub;
