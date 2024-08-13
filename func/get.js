const s3 = require("../import3");
const getFileExtension = require("../getExt");
const epubParser = require("epub-parser");
const convertArrayToObject = require("../hooks/forParseEpub");
const extractEpubInfo = require("../hooks/epubConnect");

const getBook = async (req, res) => {
  try {
    const name = req.params.filename;

    const data = await s3
      .getObject({
        Bucket: "elasticbeanstalk-eu-west-3-507450525930/books",
        Key: name,
      })
      .promise();

    const ext = getFileExtension(name);
    if (ext === "epub") {
      // const resPub = await extractEpubInfo(data.Body);

      // console.log("Title:", resPub.title);
      // console.log("Author:", resPub.author);
      // if (result.image) {
      //   const imageOutputPath = path.join(__dirname, "extracted_image.jpg");
      //   fs.writeFileSync(imageOutputPath, resPub.image);
      //   console.log("Image saved to:", imageOutputPath);
      // } else {
      //   console.log("No image found.");
      // }

      epubParser.open(data.Body, function (err, epubData) {
        if (err) {
          console.error(err);
          res.status(500).send({ error: "Error parsing EPUB file" });
        } else {
          const metaData = convertArrayToObject(epubData.easy.simpleMeta);
          const bookInfo = {
            title: metaData.dc_title,
            author: metaData.dc_creator,
            date: metaData.dc_date,
            lang: metaData.dc_language,
            desc: metaData.dc_description,
          };
          res.status(200).send(bookInfo);
        }
      });
    }
  } catch (error) {
    if (error.code === "NoSuchKey") {
      res.status(404).send("File not found");
    } else {
      console.error("Error fetching the book:", error);
      res.status(500).send("Error fetching the book");
    }
  }
};

module.exports = getBook;
