const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "baganwala"
    );

    // Fetch full user from MongoDB
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user object to request
    req.user = user;

    next();

  } catch (err) {

    console.error("Auth Middleware Error:", err);

    return res.status(401).json({ message: "Invalid Token" });
  }
};
