const User = require("../../models/User");
const Blog = require("../../models/Blog");

module.exports ={


getProfile : async (req, res) => {
  res.json(req.user);
},

myBlogs: async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.user._id,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);

  } catch (error) {
    console.log("MY BLOGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch user blogs" });
  }
},


updateProfile: async (req, res) => {

  try {

    const { name, dob, email } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id, // ✅ correct field
      { name, dob, email },
      { new: true }
    ).select("-password");

    res.json(updated);

  } catch (error) {

    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      message: "Profile update failed"
    });

  }
},

getBlogsByCategory : async (req, res) => {
  try {
    const { id } = req.params;

    const blogs = await Blog.find({
      category: id,        // ✅ Changed from category_id to category
      status: "published"
    })
      .populate("category", "name") // ✅ Changed from category_id to category
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);

  } catch (error) {
    console.log("CATEGORY BLOG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
},

deleteBlog : async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Only owner can delete
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await blog.deleteOne();

    res.json({ message: "Blog deleted successfully" });

  } catch (error) {
    console.log("DELETE BLOG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
},

}
