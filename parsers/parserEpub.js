const epubParser = require("epub-parser");
const convertArrayToObject = require("../hooks/forParseEpub");
const fs = require("fs");

const parseEpub = async (data, name) => {
  // Write the EPUB data to a file first
  try {
    fs.writeFileSync(`./timeBooks/books/${name}`, data);

    return new Promise((resolve, reject) => {
      // Parse the EPUB file once it's written
      epubParser.open(
        `http://localhost:4444/books/${name}`,
        (err, epubData) => {
          if (err) {
            reject(`Error parsing EPUB file: ${err}`);
          } else {
            // Convert metadata to an object and extract relevant details
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
        },
      );
    });
  } catch (err) {
    return Promise.reject(`Error writing EPUB file: ${err}`);
  }
};

module.exports = parseEpub;
