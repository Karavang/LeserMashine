const multer = require("multer");
const s3 = require("./import3");
const multerS3 = require("multer-s3");
const getFileExtension = require("./getExt");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "elasticbeanstalk-eu-west-3-507450525930",

    acl: "public-read",
    key: (req, file, cb) => {
      const ext = getFileExtension(file.originalname);

      if (ext === "epub" || ext === "fb2" || ext === "pdf") {
        cb(null, `books/${file.originalname}`);
      }
    },
  }),
});
module.exports = upload;
