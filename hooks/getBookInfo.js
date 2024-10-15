const getFileExtension = require("../getExt");
const parseEpub = require("../parsers/parserEpub");
const parseFb2 = require("../parsers/parsfb2");
const parsePdf = require("../parsers/parserPdf.js");

const getBookInfo = async (name, data) => {
  if (name !== undefined && Buffer.isBuffer(data)) {
    try {
      console.log("Received data buffer of length:", data.length);
      const ext = getFileExtension(name);

      const stringData = data.toString("utf-8");

      if (ext === "epub") {
        return parseEpub(data, name);
      } else if (ext === "fb2") {
        return parseFb2(stringData, name);
      } else if (ext === "pdf") {
        return await parsePdf(data, name);
      } else {
        return "It isn't epub, fb2 or pdf";
      }
    } catch (error) {
      console.error("Error processing file: ", error);
      return null;
    }
  }
  return null;
};

module.exports = getBookInfo;
