const epubParser = require("epub-parser");
const convertArrayToObject = require("../hooks/forParseEpub");

const parseEpub = (data, name) => {
  return new Promise((resolve, reject) => {
    epubParser.open(data, function (err, epubData) {
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
