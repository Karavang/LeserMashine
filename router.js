const { Router } = require("express");

const addNewBook = require("./func/post");
const upload = require("./upload");
const getBook = require("./func/get");
const getAllBooks = require("./func/getAll");
const deleteOne = require("./func/delete");

const router = new Router();

router.get("/downloadOne/:filename", getBook);
router.get("/getAll", getAllBooks);
router.post("/putNewOne", upload.single("file"), addNewBook);
router.delete("/deleteOne/:filename", deleteOne);
module.exports = router;
