const { Router } = require("express");

const getAllBooks = require("./func/getAll");
const deleteOne = require("./func/delete");
const getBookContent = require("./func/get");
const multer = require("multer");
const uploadToS3AndSaveToDb = require("./upload");
const login = require("./auth/login");
const auth = require("./auth/auth");
const registration = require("./auth/create");
const logout = require("./auth/logout");
const updateMongo = require("./hooks/updateMongo");
const flipPage = require("./hooks/flipPage");
const getBooksInRead = require("./hooks/getBooksInRead");

const router = new Router();

router.get("/downloadOne/:filename", auth, getBookContent);
router.get("/getAll", auth, getAllBooks);
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/putNewOne",

  upload.single("file"),
  auth,
  uploadToS3AndSaveToDb,
  (req, res) => {
    res.json({
      message: "File uploaded successfully",
      location: req.fileLocation,
    });
  },
);
router.get("/synchronizeBooks", auth, updateMongo);
router.delete("/deleteOne/:filename", auth, deleteOne);
router.post("/pageWasFlipped", auth, flipPage);
router.get("/booksInRead", auth, getBooksInRead);
// Authorization
router.post("/registration", registration);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
