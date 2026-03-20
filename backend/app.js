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

connectDB();


app.use(cors({
  origin: ['http://localhost:5173', 'https://iblog-frontend.onrender.com'], // Array allows both!
  credentials: true                
}));
app.use("/images", express.static("public/images"));

// Logger
app.use(logger("dev"));

// Body parsers (for JSON requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File Upload (MUST come after body parser)
// File Upload (MUST come after body parser)
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
