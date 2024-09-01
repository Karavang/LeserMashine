const { Router } = require("express");

const addNewBook = require("./func/post");
const s3upload = require("./upload");
const getAllBooks = require("./func/getAll");
const deleteOne = require("./func/delete");
const getBookContent = require("./func/get");
const mongoPost = require("./middleware/mongoPost");

const router = new Router();

router.get("/downloadOne/:filename", getBookContent);
router.get("/getAll", getAllBooks);
router.post(
  "/putNewOne",
  // mongoPost.single("file"),
  s3upload.single("file"),
  addNewBook,
);

router.delete("/deleteOne/:filename", deleteOne);

module.exports = router;
