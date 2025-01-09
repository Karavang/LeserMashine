const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

const s3Client = new S3Client({ region: "eu-west-3" }); // Replace with your region

// Ensure the timeBooks directory exists

// Serve static files from the booksDir directory

const getBookContent = async (req, res) => {
  const booksDir = path.join(__dirname, "../timeBooks/books");
  try {
    const name = req.params.filename;
    const command = new GetObjectCommand({
      Bucket: "elasticbeanstalk-eu-west-3-507450525930",
      Key: `books/${name}`,
    });

    const { Body } = await s3Client.send(command);
    const epubBuffer = await streamToBuffer(Body);
    const filePath = path.join(booksDir, name);

    // Write the file synchronously
    fs.writeFileSync(filePath, epubBuffer);
    if (fs.existsSync(filePath)) {
    } else {
      console.error("File was not found after saving:", filePath);
    }
    // Return the file URL
    res.status(200).send(`https://api.leser.cloud//books/${name}`);
  } catch (error) {
    if (error.name === "NoSuchKey") {
      res.status(404).send("File not found");
    } else {
      console.error("Error fetching the book:", error);
      res.status(500).send("Error fetching the book");
    }
  }
};

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

module.exports = getBookContent;
