const mongoose = require("mongoose")
const { mediaSchema } = require("./media")

const postSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  content: String,
  media: [mediaSchema],
  postTags: [String],
  category: String,
}, {timestamps: true})

const Post = mongoose.model('Post', postSchema);

module.exports = Post
