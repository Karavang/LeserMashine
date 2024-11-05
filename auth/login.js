const jwt = require("jsonwebtoken");
const { User } = require("../mongoDB");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password",
      data: "Bad request",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, secret);
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};
module.exports = login;
