const getBookInfoForMongo = require("../hooks/getBookInfoForMongo");
const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { Post } = require("../mongoDB");

const updateMongo = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const client = new S3Client({ region: "eu-west-3" });
  try {
    const command = new ListObjectsV2Command({
      Bucket: "elasticbeanstalk-eu-west-3-507450525930",
      Prefix: "books/",
    });
    const { Contents } = await client.send(command);

    let fileNames = Contents.map((item) => item.Key.split("/").pop());
    fileNames.shift();

    for (const name of fileNames) {
      const bookInfo = await getBookInfoForMongo(name);
      const post = await Post.findOne({ filename: name });
      if (!post && typeof bookInfo === "object") {
        await Post.create(bookInfo);
      }
    }

    res.status(200).json("Successfully synchronized");
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = updateMongo;
