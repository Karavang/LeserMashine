const { GetObjectCommand } = require("@aws-sdk/client-s3");

const getAllBooks = async (req, res) => {
  const input = {
    Bucket: "elasticbeanstalk-eu-west-3-507450525930",
    Key: "test.txt",
  };
  const command = new GetObjectCommand(input);
  const response = await client.send(command);

  if (!response) {
    res.status(500).json(response);
  } else {
    res.status(200).json(response);
  }
};
module.exports = getAllBooks;
