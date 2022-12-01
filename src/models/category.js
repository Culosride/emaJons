const mongoose = require("mongoose")

const categorySchema = ({
    name: String,
    allTags: []
  }, {timestamps: true})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category
