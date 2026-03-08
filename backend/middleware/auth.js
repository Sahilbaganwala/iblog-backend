const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyUser = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "baganwala"
    );

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // IMPORTANT
    req.user = user;

    next();

  } catch (error) {
    console.log("AUTH ERROR:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
