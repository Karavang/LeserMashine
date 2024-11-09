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
    owner: {
      type: String,
      required: false,
    },
  },
  { versionKey: false },
);

const schemaUser = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const Post = model("books", schemaPost);
const User = model("lesers", schemaUser);
const mongoConnect = async () => {
  try {
    await connect(fromenv.MONGO);

    console.log("connected");
  } catch (error) {
    console.log(`We has any problems with connection to db. Error:${error}`);
  }
};

module.exports = { Post, User, mongoConnect };
