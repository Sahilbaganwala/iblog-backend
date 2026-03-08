const User = require("../../models/User");
const Blog = require("../../models/Blog");
const Category = require("../../models/Category");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports ={
// ============================
// ADMIN REGISTER
// ============================
register : async (req, res) => {
  try {
    const { name, email, password, phonenumber, dob } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      phonenumber,
      dob: dob ? new Date(dob) : null,
      role: "admin"
    });

    const token = jwt.sign(
      { userId: newUser._id, role: "admin" },
      process.env.JWT_SECRET || "baganwala",
      { expiresIn: "5d" }
    );

    const userData = newUser.toObject();
    delete userData.password;

    res.status(201).json({
      message: "Admin created successfully",
      user: { ...userData, token }
    });

  } catch (error) {
    console.log("ADMIN REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
},


// ============================
// ADMIN LOGIN
// ============================
login : async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: admin._id, role: "admin" },
      process.env.JWT_SECRET || "baganwala",
      { expiresIn: "5d" }
    );

    res.json({
      message: "Admin login success",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token
      }
    });

  } catch (err) {
    console.log("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
},


// ============================
// DASHBOARD STATS
// ============================
dashboard : async (req, res) => {
  try {

    const users = await User.countDocuments();
    const blogs = await Blog.countDocuments();
    const categories = await Category.countDocuments();

    res.json({
      users,
      blogs,
      categories
    });

  } catch (error) {
    res.status(500).json({ message: "Dashboard error" });
  }
},


// ============================
// GET ALL USERS
// ============================
getUsers : async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: "Fetch users failed" });
  }
},


// ============================
// TOGGLE USER STATUS
// ============================
toggleUserStatus : async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: "User status updated",
      status: user.isBlocked
    });

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
},


// ============================
// GET ALL BLOGS
// ============================
getBlogs : async (req, res) => {
  try {

    const blogs = await Blog.find()
      .populate("author", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(blogs);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Fetch blogs failed" });
  }
},


// ============================
// UPDATE BLOG STATUS
// ============================
updateBlogStatus : async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.status = blog.status === "approved" ? "pending" : "approved";
    await blog.save();

    res.json({
      message: "Blog status updated",
      status: blog.status
    });

  } catch (error) {
    res.status(500).json({ message: "Status update failed" });
  }
},


// ============================
// CREATE CATEGORY
// ============================
createCategory : async (req, res) => {
  try {

    const { name } = req.body;

    const exists = await Category.findOne({ name });

    if (exists) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name });

    res.status(201).json(category);

  } catch (error) {
    res.status(500).json({ message: "Category create failed" });
  }
},


// ============================
// GET ALL CATEGORIES
// ============================
getCategories : async (req, res) => {
  try {

    const categories = await Category.find().sort({ createdAt: -1 });

    res.json(categories);

  } catch (error) {
    res.status(500).json({ message: "Fetch categories failed" });
  }
},


// ============================
// DELETE CATEGORY
// ============================
deleteCategory : async (req, res) => {
  try {

    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "Category deleted" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
},

}
