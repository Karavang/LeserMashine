const epubParser = require("epub-parser");
const s3 = require("../import3");
const getFileExtension = require("../getExt");
const convertArrayToObject = require("./forParseEpub");
const xml2js = require("xml2js");
const parser = new xml2js.Parser({ explicitArray: false });

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
      } else if (ext === "fb2") {
        return new Promise((resolve, reject) => {
          const fb2Data = data.Body.toString();
          parser.parseString(fb2Data, (err, result) => {
            if (err) {
              reject(err);
            } else {
              try {
                const description = result["FictionBook"]["description"];
                const titleInfo = description["title-info"];
                const title = titleInfo["book-title"];
                const authors = titleInfo["author"];
                const date = titleInfo["date"];
                const lang = titleInfo["lang"];
                const desc = Array.isArray(description["annotation"]?.p)
                  ? description["annotation"].p.join("\n")
                  : description["annotation"]?.p || "";
                let authorNames = [];
                if (Array.isArray(authors)) {
                  authorNames = authors.map(
                    (author) =>
                      `${author["first-name"]} ${author["last-name"]}`,
                  );
                } else {
                  authorNames.push(
                    `${authors["first-name"]} ${authors["last-name"]}`,
                  );
                }

                const bookInfo = {
                  title: title,
                  author: authorNames.join(", "),
                  date: date._,
                  lang: lang,
                  desc: desc,
                  filename: name,
                };

                resolve(bookInfo);
              } catch (e) {
                reject("Error extracting metadata from FB2: " + e);
              }
            }
          });
        });
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
