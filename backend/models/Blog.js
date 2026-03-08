const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,

    // 👇 CHANGE THIS: Rename 'category_id' to 'category'
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    // 👆 END CHANGE

    status: {
      type: String,
      enum: ["published", "pending"],
      default: "published",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Blog", blogSchema);