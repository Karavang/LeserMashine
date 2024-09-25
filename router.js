const { Router } = require("express");

const addNewBook = require("./func/post");
const { handleFileUpload, processUpload } = require("./upload");
const getAllBooks = require("./func/getAll");
const deleteOne = require("./func/delete");
const getBookContent = require("./func/get");
const multer = require("multer");
const uploadToS3AndSaveToDb = require("./upload");

const router = new Router();

router.get("/downloadOne/:filename", getBookContent);
router.get("/getAll", getAllBooks);
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/putNewOne",
  upload.single("file"),
  uploadToS3AndSaveToDb,
  (req, res) => {
    res.json({
      message: "File uploaded successfully",
      location: req.fileLocation,
    });
  },
);

router.delete("/deleteOne/:filename", deleteOne);

module.exports = router;
