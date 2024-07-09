const { Router } = require("express");
const getAllBooks = require("./func/get");
const addNewBook = require("./func/post");

const router = new Router();

router.get("/getAll", getAllBooks);
router.post("/putNewOne", addNewBook);
module.exports = router;
