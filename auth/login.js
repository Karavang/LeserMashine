const jwt = require("jsonwebtoken");
const { User } = require("../mongoDB");
require("dotenv").config();
const { JWT_SECRET } = process.env;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Email and password are required",
        data: "Bad request",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Invalid credentials",
        data: "Unauthorized",
      });
    }

    // Verify password - Note: You should use bcrypt or similar for password hashing
    if (password !== user.password) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Invalid credentials",
        data: "Unauthorized",
      });
    }

    // Prepare token payload
    const payload = {
      id: user.id,
      username: user.username,
    };

    // Token verification and renewal logic
    if (user.token && user.token !== " ") {
      try {
        const decoded = jwt.verify(user.token, JWT_SECRET);

        // If token is valid and belongs to user
        if (decoded.id === user.id) {
          return res.status(200).json({
            status: "success",
            code: 200,
            data: {
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                token: user.token,
              },
            },
          });
        }
      } catch (tokenError) {
        // Token verification failed - will generate new token below
        console.log("Token verification failed:", tokenError.message);
      }
    }

    // Generate new token
    const newToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "30d",
    });

    // Update user with new token
    await User.findOneAndUpdate(
      { _id: user.id },
      { token: newToken },
      { new: true },
    );

    // Return success response with new token
    return res.status(200).json({
      status: "success",
      code: 200,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          token: newToken,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
      data: null,
    });
  }
};

module.exports = login;
