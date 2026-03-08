const Blog = require("../../models/Blog");

module.exports = {

  // GET ALL BLOGS (ADMIN)
  getAllBlogs: async (req, res) => {
    try {

      const blogs = await Blog.find()
        .populate("user_id", "name email")
        .populate("category_id", "name")
        .sort({ createdAt: -1 });

      res.json(blogs);

    } catch (err) {
      res.status(500).json(err);
    }
  },

  // CHANGE BLOG STATUS
  updateBlogStatus: async (req, res) => {
    try {

      const { status } = req.body;

      const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      res.json(blog);

    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE BLOG
  deleteBlog: async (req, res) => {
    try {

      await Blog.findByIdAndDelete(req.params.id);

      res.json({ message: "Blog deleted successfully" });

    } catch (err) {
      res.status(500).json(err);
    }
  },
  createCategory : async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
    }
    
  },

};
