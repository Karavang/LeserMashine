const { Schema, model, connect } = require("mongoose");
const fromenv = process.env;
const schemaPost = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: false,
    },
    lang: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      required: false,
    },
    filename: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

const Post = model("books", schemaPost);

const mongoConnect = async () => {
  
  try {
    
    await connect(fromenv.MONGO);

    console.log("connected");
  } catch (error) {
    console.log(`We has any problems with connection to db. Error:${error}`);
  }
};

module.exports = { Post, mongoConnect };
