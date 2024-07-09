const express = require("express");
const cors = require("cors");
const router = require("./router");
require("dotenv/config");
const app = express();
const startServer = async () => {
  app.listen(5555, () => {
    console.log("Server woke up");
  });
};
app.use(cors());
app.use(express.json());
app.use("/", router);
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({ message: err.message });
});

startServer();
