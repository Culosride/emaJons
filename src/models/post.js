const mongoose = require("mongoose")
const { imageSchema } = require("./image")
const { tagSchema } = require("./tag")

const postSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  content: String,
  images: [imageSchema],
  postTags: [tagSchema],
  category: String,
}, {timestamps: true})

const Post = mongoose.model('Post', postSchema);

module.exports = Post
