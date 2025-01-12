const express = require("express");
const cors = require("cors");
const router = require("./router");

const { mongoConnect } = require("./mongoDB");
require("dotenv/config");
const app = express();
const startServer = async () => {
  await mongoConnect();
  app.listen(4444, () => {
    console.log("Server woke up on 4444");
  });
};
const corsOpt = {
  origin: ["http://localhost:5173", "https://leser.cloud"],
};
// app.use(cors(corsOpt));
app.use(express.json());
app.use(express.static("./timeBooks"));

app.use("/", router);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({ message: err.message });
});

startServer();
