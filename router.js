const { Router } = require("express");

const addNewBook = require("./func/post");
const upload = require("./upload");
const getBook = require("./func/get");
const getAllBooks = require("./func/getAll");

const router = new Router();

router.get("/downloadOne/:filename", getBook);
router.get("/getAll", getAllBooks);
router.post("/putNewOne", upload.single("file"), addNewBook);
module.exports = router;
