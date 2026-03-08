const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  status: Boolean
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
