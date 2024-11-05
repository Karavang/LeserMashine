const jwt = require("jsonwebtoken");
const { User } = require("../mongoDB");
const { JWT_SECRET } = process.env;

const auth = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer === "Bearer") {
      const { id } = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(id);
      if (!user || user.token !== token) {
        res.status(401).json({ message: "Not authorized" });
        return;
      }

      req.user = user;
      next();
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = auth;
