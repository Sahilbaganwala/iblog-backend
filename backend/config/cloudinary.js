const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// mongodb+srv://<db_username>:<db_password>@cluster0.u8yhzjq.mongodb.net/

module.exports = cloudinary;
