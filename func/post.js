const addNewBook = async (req, res) => {
  if (req.file) {
    res.status(200).json("Success! Location: " + req.file.location);
  } else {
    res.status(500).json(`Error`);
  }
};
module.exports = addNewBook;
