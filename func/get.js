const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const getAllBooks = async () => {
  await s3.listObjectsV2(
    {
      Bucket: "elasticbeanstalk-eu-west-3-507450525930",
      Prefix: "books/",
    },
    function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.Contents);
        data.Contents.forEach((object) => {
          console.log(object);
        });
      }
    },
  );
};
module.exports = getAllBooks;
