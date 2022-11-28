const mongoose = require("mongoose")

const categorySchema = ({
    name: String,
    allTags: [],
    posts: [postSchema]
  }, {timestamps: true})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category
