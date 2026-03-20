const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminMiddleware");

// Controllers
const authController = require("../controller/app/authController");
const blogController = require("../controller/app/blogController");
const categoryController = require("../controller/app/categoryController");
const userController = require("../controller/app/userController")



router.post("/register", authController.userSignUp);
router.post("/login", authController.userLogin);
router.post("/blogs", auth, blogController.createBlog);
router.get("/blogs", blogController.getAllBlogs);
router.get("/blogs/:id", blogController.getBlogById);

// PROFILE ROUTES
router.get("/profile", auth.verifyUser, userController.getProfile);
router.get("/profile/myBlogs", verifyUser, userController.myBlogs);
router.put("/profile/update", verifyUser, userController.updateProfile);
router.get("/categories", categoryController.getCategories);
router.get("/blogs/category/:id", userController.getBlogsByCategory);
router.delete("/blogs/:id", verifyUser, userController.deleteBlog);
router.put("/updateblog/:id", verifyUser, blogController.updateBlog);


// AUTH


// PROFILE


// BLOGS (USER)


// CATEGORIES (PUBLIC)

// ADMIN CATEGORY


module.exports = router;
