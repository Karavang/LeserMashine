const multer = require("multer");
const s3 = require("./import3");
const multerS3 = require("multer-s3");
const getFileExtension = require("./getExt");
const getBookInfo = require("./hooks/getBookInfo");
const { Post } = require("./mongoDB");

const uploadToS3AndSaveToDb = async (req, res, next) => {
  if (!req.file) {
    return next(new Error("No file uploaded"));
  }

  try {
    const ext = getFileExtension(req.file.originalname);

    if (ext !== "epub" && ext !== "fb2") {
      throw new Error("Invalid file type");
    }

    const bookData = await getBookInfo(req.file.originalname, req.file.buffer);

    await Post.create(bookData);
    const dataFromMongo = await Post.findOne({ title: bookData.title });

    const params = {
      Bucket: "elasticbeanstalk-eu-west-3-507450525930",
      Key: `books/${dataFromMongo._id.toString()}.${ext}`,
      Body: req.file.buffer,
      ACL: "public-read",
    };

    const s3UploadResult = await s3.upload(params).promise();
    req.fileLocation = s3UploadResult.Location;

    next();
  } catch (error) {
    console.error("Error processing file:", error);
    next(error);
  }
};

module.exports = uploadToS3AndSaveToDb;
