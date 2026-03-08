const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminMiddleware");

// Controllers
const authController = require("../controller/app/authController");
const blogController = require("../controller/app/blogController");
const categoryController = require("../controller/app/categoryController");



// AUTH


// PROFILE


// BLOGS (USER)


// CATEGORIES (PUBLIC)

// ADMIN CATEGORY


module.exports = router;
