const multer = require("multer");
const s3 = require("./import3");
const multerS3 = require("multer-s3");
const getFileExtension = require("./getExt");
const getBookInfo = require("./hooks/getBookInfo");
const { Post } = require("./mongoDB");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "elasticbeanstalk-eu-west-3-507450525930",

    acl: "public-read",
    key: async (req, file, cb) => {
      // make the key function async
      try {
        const ext = getFileExtension(file.originalname);
        const bookData = await getBookInfo(file); // use await to get book info
        console.log(bookData);
        await Post.create(bookData); // save book info to MongoDB

        if (ext === "epub" || ext === "fb2") {
          cb(null, `books/${file.originalname}`);
        } else {
          cb(new Error("Invalid file type"), false); // handle unsupported file types
        }
      } catch (error) {
        console.error("Error processing file:", error);
        cb(error, false); // handle any error that occurs during processing
      }
    },
  }),
});

module.exports = upload;
