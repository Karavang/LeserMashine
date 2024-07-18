const multer = require("multer");
const s3 = require("./import3");
const multerS3 = require("multer-s3");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "elasticbeanstalk-eu-west-3-507450525930",

    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, `books/${file.originalname}`);
    },
  }),
});
module.exports = upload;
