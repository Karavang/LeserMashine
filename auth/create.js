const validateEmail = require("../middleware/validation/email");
const { User } = require("../mongoDB");

const registration = async (req, res, next) => {
  const { username, email, password } = req.body;
  const isEmail = validateEmail(email);
  if (!isEmail) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "It isn't email",
      data: "Conflict",
    });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = registration;
