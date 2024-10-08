const s3 = require("../import3");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

// Ensure the timeBooks directory exists

// Serve static files from the booksDir directory

const getBookContent = async (req, res) => {
  const booksDir = path.join(__dirname, "../timeBooks/books");
  try {
    const name = req.params.filename;
    const data = await s3.send(
      new GetObjectCommand({
        Bucket: "elasticbeanstalk-eu-west-3-507450525930/books",
        Key: name,
      }),
    );

    const epubBuffer = Buffer.from(data.Body);
    const filePath = path.join(booksDir, name);

    // Write the file synchronously
    fs.writeFileSync(filePath, epubBuffer);
    if (fs.existsSync(filePath)) {
    } else {
      console.error("File was not found after saving:", filePath);
    }
    // Return the file URL
    res.status(200).send(`http://localhost:5555/books/${name}`);
  } catch (error) {
    if (error.code === "NoSuchKey") {
      res.status(404).send("File not found");
    } else {
      console.error("Error fetching the book:", error);
      res.status(500).send("Error fetching the book");
    }
  }
};

module.exports = getBookContent;
