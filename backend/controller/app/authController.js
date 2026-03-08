const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


module.exports = {

  // ================================
  // SIGN UP
  // ================================

  userSignUp: async (req, res) => {
    try {

      const { name, email, password, phonenumber, dob } = req.body;

      // Check existing user
      const existing = await User.findOne({ email });

      if (existing) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash password
      const hashed = bcrypt.hashSync(password, 10);

      // Format DOB
      const formattedDob = dob ? new Date(dob) : null;

      // Create user
      const newUser = await User.create({
        name,
        email,
        password: hashed,
        phonenumber,
        dob: formattedDob,
        role: req.body.role || "user",
      });

      // Create JWT token
      const token = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET || "baganwala",
        { expiresIn: "5d" }
      );

      let userData = newUser.toObject();
      userData.token = token;
      delete userData.password;

      return res.status(200).json({
        message: "User created successfully",
        user: userData
      });

    } catch (error) {

      console.log("SIGNUP ERROR:", error);

      return res.status(500).json(error);
    }
  },


  // ================================
  // LOGIN
  // ================================


userLogin: async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email ONLY
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role || "user"
      },
      process.env.JWT_SECRET || "baganwala",
      { expiresIn: "5d" }
    );

    res.status(200).json({
      message: "User login success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        token
      }
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
},


};
