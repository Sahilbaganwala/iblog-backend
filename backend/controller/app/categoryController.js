const Category = require("../../models/Category");

module.exports ={
// CREATE CATEGORY (ADMIN)
createCategory : async (req, res) => {

  try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name required" });
    }

    const exists = await Category.findOne({ name });

    if (exists) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = await Category.create({ name });

    res.json({
      message: "Category created",
      category
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
},


// GET ALL CATEGORIES (PUBLIC)
getCategories : async (req, res) => {

  try {

    const categories = await Category.find().sort({ createdAt: -1 });

    res.json(categories);

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
},


// DELETE CATEGORY (ADMIN)
deleteCategory : async (req, res) => {

  try {

    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "Category deleted" });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
},

}
