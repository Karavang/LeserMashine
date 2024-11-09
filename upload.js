const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const getFileExtension = require("./getExt");
const getBookInfo = require("./hooks/getBookInfo");
const { Post } = require("./mongoDB");

const s3Client = new S3Client({ region: "eu-west-3" });

const uploadToS3AndSaveToDb = async (req, res, next) => {
  if (!req.file) {
    return next(new Error("No file uploaded"));
  }

  try {
    const ext = getFileExtension(req.file.originalname);

    if (ext !== "epub" && ext !== "fb2" && ext !== "pdf") {
      throw new Error("Invalid file type");
    }

    const bookData = await getBookInfo(req.file.originalname, req.file.buffer);

    await Post.create(bookData);
    const dataFromMongo = await Post.findOne({ title: bookData.title });
    await Post.findByIdAndUpdate(
      { _id: dataFromMongo._id },
      { filename: `${dataFromMongo._id.toString()}.${ext}` },
      // {owner:}
    );

    const params = {
      Bucket: "elasticbeanstalk-eu-west-3-507450525930",
      Key: `books/${dataFromMongo._id.toString()}.${ext}`,
      Body: req.file.buffer,
      ACL: "public-read",
    };

    const command = new PutObjectCommand(params);
    const s3UploadResult = await s3Client.send(command);

    req.fileLocation = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

    next();
  } catch (error) {
    console.error("Error processing file:", error);
    next(error);
  }
};

module.exports = uploadToS3AndSaveToDb;
