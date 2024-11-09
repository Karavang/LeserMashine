const jwt = require("jsonwebtoken");
const { User } = require("../mongoDB");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login",
      data: "Bad request",
    });
  }
  if (password !== user.password) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect password",
      data: "Bad request",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const tokenMongo = user.token;
  if (user.token !== " ") {
    try {
      const decoded = jwt.verify(tokenMongo, JWT_SECRET);
      if (decoded.id === user.id) {
        return res.status(200).json({
          status: "success",
          code: 200,
          data: {
            tokenMongo,
          },
        });
      } else {
        const tokenN = jwt.sign(payload, JWT_SECRET, {
          expiresIn: "30d",
        });
        await User.findOneAndUpdate({ _id: user.id }, { token: tokenN });
        res.json({
          status: "success",
          code: 200,
          data: {
            tokenN,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    const tokenN = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "30d",
    });
    await User.findOneAndUpdate({ _id: user.id }, { token: tokenN });

    res.json({
      status: "success",
      code: 200,
      data: {
        tokenN,
      },
    });
  }
};

module.exports = login;
