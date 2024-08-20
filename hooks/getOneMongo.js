const { Post } = require("../mongoDB");

const getOneMongo = (name) => {
  Post.find(name);
};
