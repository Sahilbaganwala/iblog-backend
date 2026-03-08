const express = require("express");
const router = express.Router();

const adminController = require("../controller/admin/adminController");

// TEST
// console.log("ADMIN CONTROLLER:", adminController);

// AUTH
router.post("/register", adminController.register);
router.post("/adminlogin", adminController.login);

// DASHBOARD
router.get("/dashboard", adminController.dashboard);

// USERS
router.get("/users", adminController.getUsers);
router.put("/user/:id", adminController.toggleUserStatus);

// BLOGS
router.get("/blogs", adminController.getBlogs);
router.put("/blog/status/:id", adminController.updateBlogStatus);

// CATEGORY
router.post("/category", adminController.createCategory);
router.get("/categories", adminController.getCategories);
router.delete("/category/:id", adminController.deleteCategory);

module.exports = router;
