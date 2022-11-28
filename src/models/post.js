const mongoose = require("mongoose")
const { imageSchema } = require("./image")

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  content: String,
  images: [imageSchema],
  postTags: []
}, {timestamps: true})

const Post = mongoose.model('Post', postSchema);

module.exports = Post
