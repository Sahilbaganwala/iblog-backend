const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const connectDB = require("./database/mongo");

// ROUTES
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");

const app = express();

// =========================
// DATABASE
// =========================
connectDB();

// =========================
// MIDDLEWARE ORDER (IMPORTANT)
// =========================

// CORS must be first
app.use(cors({
  origin: 'http://localhost:5173', // specific origin
  credentials: true                // allow session cookie from browser to pass through
}));app.use("/images", express.static("public/images"));

// Logger
app.use(logger("dev"));

// Body parsers (for JSON requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File Upload (MUST come after body parser)
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  useTempFiles: false,
  createParentPath: true,
}));

// Cookies
app.use(cookieParser());

// Static public folder
app.use(express.static(path.join(__dirname, "public")));

// =========================
// ROUTES
// =========================

app.use("/", userRoutes);
app.use("/admin", adminRoutes);

// =========================
// 404 HANDLER
// =========================

app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});

// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 4000;

app.listen(4000, () => {
  console.log(`Server running at http://localhost:4000`);
});

module.exports = app;
