const jwt = require("jsonwebtoken");
const { User } = require("../mongoDB");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const logout = async (req, res) => {
  const { authorization = "" } = req.headers;

  const [bearer, token] = authorization.split(" ");
  const user = jwt.verify(token, JWT_SECRET);

  try {
    const mongoToken = await User.findById(user.id);
    if (token !== mongoToken.token) {
      return res.status(401).json({ message: "Invalid token" });
    }
    await User.findByIdAndUpdate({ _id: user.id }, { token: " " });
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Logged out",
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = logout;
