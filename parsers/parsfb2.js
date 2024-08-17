const xml2js = require("xml2js");
const parser = new xml2js.Parser({ explicitArray: false });

const parseFb2 = (data, name) => {
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
              (author) => `${author["first-name"]} ${author["last-name"]}`,
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
};

module.exports = parseFb2;
