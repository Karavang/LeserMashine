const pdf = require("pdf-parse");

const parserPdf = async (data, name) => {
  const pdfData = await pdf(data);
  console.log(pdfData);
};
module.exports = parserPdf;
