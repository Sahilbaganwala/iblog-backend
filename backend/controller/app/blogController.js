const Blog = require("../../models/Blog");
const Category = require("../../models/Category");
const path = require("path");

module.exports = {
  // ================================
  // CREATE BLOG
  // ================================

  createBlog: async (req, res) => {
    try {
      const { title, category_id, short_description, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          message: "Title and content are required",
        });
      }

      let imagePath = null;

      if (req.files && req.files.thumbnail) {
        const image = req.files.thumbnail;

        const uploadDir = path.join(__dirname, "../../public/images");

        const fileName = Date.now() + "_" + image.name;

        const uploadPath = path.join(uploadDir, fileName);

        await image.mv(uploadPath);

        imagePath = `/images/${fileName}`;
      }

      // ✅ SAVE TO DATABASE
      // ✅ SAVE TO DATABASE
      const blog = await Blog.create({
        title,
        description: short_description,
        image: imagePath,

        category: category_id, // ✅ CORRECT: Map the ID to the 'category' field

        author: req.user.id,
        user_id: req.user.id,

        status: "published",
      });
      return res.status(201).json({
        success: true,
        message: "Blog created successfully",
        blog,
      });
    } catch (error) {
      console.error("BLOG CREATE ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // ================================
  // UPDATE BLOG
  // ================================

 // backend/controller/app/blogController.js

updateBlog: async (req, res) => {
  try {
    const id = req.params.id;
    let updateData = { ...req.body };

    // 1. Handle File Upload correctly (if using express-fileupload)
    if (req.files && req.files.thumbnail) {
      const image = req.files.thumbnail;
      const uploadDir = path.join(__dirname, "../../public/images");
      const fileName = Date.now() + "_" + image.name;
      const uploadPath = path.join(uploadDir, fileName);

      await image.mv(uploadPath);
      updateData.image = `/images/${fileName}`; // Set the new image path
    }

    // 2. Ensure category is handled if passed as ID
    if (updateData.category_id) {
       updateData.category = updateData.category_id;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.status(200).json({
      message: "Blog Updated Successfully",
      updatedBlog,
    });
  } catch (error) {
    console.log("UPDATE BLOG ERROR:", error);
    return res.status(500).json(error);
  }
},
  // ================================
  // DELETE BLOG
  // ================================

  deleteBlog: async (req, res) => {
    try {
      const id = req.params.id;

      await Blog.findByIdAndDelete(id);

      return res.status(200).json("Blog Deleted Successfully");
    } catch (error) {
      console.log("DELETE BLOG ERROR:", error);

      return res.status(500).json(error);
    }
  },

  // ================================
  // GET ALL BLOGS
  // ================================

  getAllBlogs: async (req, res) => {
    try {
      const blogs = await Blog.find({ status: "published" })
        .populate("category", "name")
        .sort({ createdAt: -1 });

      return res.status(200).json(blogs);
    } catch (err) {
      console.log("GET BLOGS ERROR:", err);

      return res.status(500).json(err);
    }
  },

  // ================================
  // GET BLOG BY ID
  // ================================

 // backend/controller/app/blogController.js

// In your Backend (e.g., blogController.js)

getBlogById: async (req, res) => {
  try {
    // 1. First, get the blog WITHOUT population to check if it exists
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 2. Safely populate ONLY if the fields exist in the schema
    // We use a try/catch block specifically for population to prevent crashes
    try {
       blog = await blog.populate("category_id");
       blog = await blog.populate("user_id", "username email profilePic");
    } catch (popErr) {
       console.log("Population Warning:", popErr.message);
       // We continue even if population fails, so the app doesn't crash
    }

    return res.status(200).json(blog);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
},
  // ================================
  // GET BLOGS BY CATEGORY
  // ================================

  getBlogsByCategory: async (req, res) => {
    try {
      const { category_id } = req.params;

      const blogs = await Blog.find({ category_id })
        .populate("category_id", "name")
        .populate("user_id", "name")
        .sort({ createdAt: -1 });

      return res.status(200).json(blogs);
    } catch (error) {
      console.log("CATEGORY BLOG ERROR:", error);

      return res.status(500).json(error);
    }
  },
};
