// const express = require("express");
// const router = express.Router();

// const Category = require("../models/Category");
// const Blog = require("../models/Blog");

// // GET ALL CATEGORIES (PUBLIC)
// router.get("/categories", async (req, res) => {
//   try {
//     const categories = await Category.find({ status: true }).sort({ createdAt: -1 });
//     res.json(categories);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load categories" });
//   }
// });

// // GET ALL BLOGS (PUBLIC)
// router.get("/blogs", async (req, res) => {
//   try {
//     const blogs = await Blog.find({ status: "approved" }).populate("author category");
//     res.json(blogs);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load blogs" });
//   }
// });

// module.exports = router;
    