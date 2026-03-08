const express = require("express");
const router = express.Router();
const authController = require("../controller/app/authController")
const userController = require("../controller/app/userController")
const blogController = require("../controller/app/blogController")
const categoryController = require("../controller/app/categoryController")
const { verifyUser } = require("../middleware/auth");
const auth = require("../middleware/authMiddleware");


router.post("/register", authController.userSignUp);
router.post("/login", authController.userLogin);
router.post("/blogs", auth, blogController.createBlog);
router.get("/blogs", blogController.getAllBlogs);
router.get("/blogs/:id", blogController.getBlogById);

// PROFILE ROUTES
router.get("/profile", verifyUser, userController.getProfile);
router.get("/profile/myBlogs", verifyUser, userController.myBlogs);
router.put("/profile/update", verifyUser, userController.updateProfile);
router.get("/categories", categoryController.getCategories);
router.get("/blogs/category/:id", userController.getBlogsByCategory);
router.delete("/blogs/:id", verifyUser, userController.deleteBlog);
router.put("/updateblog/:id", verifyUser, blogController.updateBlog);




module.exports = router;
