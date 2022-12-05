const mongoose = require("mongoose")
const { imageSchema } = require("./image")

const postSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  content: String,
  images: [imageSchema],
  postTags: [String],
  category: String,
}, {timestamps: true})

const Post = mongoose.model('Post', postSchema);

module.exports = Post
