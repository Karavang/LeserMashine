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
    let s3FileNames = Contents.map((item) => item.Key.split("/").pop());
    s3FileNames.shift();

    const allMongoBooks = await Post.find({}, { filename: 1 });
    const mongoFileNames = allMongoBooks.map((book) => book.filename);

    const filesToDelete = mongoFileNames.filter(
      (filename) => !s3FileNames.includes(filename),
    );

    const filesToAdd = s3FileNames.filter(
      (filename) => !mongoFileNames.includes(filename),
    );

    if (filesToDelete.length > 0) {
      await Post.deleteMany({ filename: { $in: filesToDelete } });
    }

    for (const name of filesToAdd) {
      const bookInfo = await getBookInfoForMongo(name);
      if (typeof bookInfo === "object") {
        await Post.create(bookInfo);
      }
    }

    res.status(200).json({
      message: "Synchronization completed successfully",
      stats: {
        filesInS3: s3FileNames.length,
        filesInMongo: mongoFileNames.length,
        filesDeleted: filesToDelete.length,
        filesAdded: filesToAdd.length,
        deletedFiles: filesToDelete,
        addedFiles: filesToAdd,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = updateMongo;
