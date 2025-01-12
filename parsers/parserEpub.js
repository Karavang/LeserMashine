const EPub = require("epub");
const fs = require("fs");
const path = require("path");

const parseEpub = async (data, name) => {
  const bookPath = path.join("./timeBooks/books", name);

  try {
    // Write the EPUB data to a file
    fs.writeFileSync(bookPath, data);

    return new Promise((resolve, reject) => {
      const epub = new EPub(bookPath);

      epub.on("error", (err) => {
        reject(`Error parsing EPUB file: ${err}`);
      });

      epub.on("end", () => {
        // Extract metadata
        const bookInfo = {
          title: epub.metadata.title,
          author: Array.isArray(epub.metadata.creator)
            ? epub.metadata.creator[0]
            : epub.metadata.creator,
          date: epub.metadata.date,
          lang: epub.metadata.language,
          desc: epub.metadata.description,
          filename: name,
        };

        resolve(bookInfo);
      });

      epub.parse();
    });
  } catch (err) {
    return Promise.reject(`Error writing EPUB file: ${err}`);
  } finally {
    try {
      fs.unlinkSync(bookPath);
    } catch (err) {
      console.error("Error cleaning up temporary file:", err);
    }
  }
};

module.exports = parseEpub;
