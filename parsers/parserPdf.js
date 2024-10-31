const pdf = require("pdf-parse");

const parserPdf = async (data, name) => {
  const pdfData = await pdf(data);
  return {
    title: pdfData.info.Title,
    author: pdfData.info.Author,
    date: pdfData.metadata._metadata["dc:date"].substring(0, 4),
    lang: pdfData.metadata._metadata["dc:lang"],
    desc: pdfData.metadata._metadata["dc:description"],
    filename: name,
  };
};
module.exports = parserPdf;
