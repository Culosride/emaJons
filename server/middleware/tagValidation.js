const Category = require('../models/category');
// const User = require("../models/user")
const _ = require("lodash")

const tagValidation = async (req, res, next) => {
  const { newTag } = req.body
  if(newTag, /^\s*$/.test(newTag)) return res.status(400).json({message: "Invalid tag"})

  const capitalizedTag = _.capitalize(newTag)
  const selectedCategory = await Category.findOne({}).exec();
  selectedCategory.allTags.some(catTag => catTag === capitalizedTag) ?
  res.status(400).json({message: "Tag already exists"}) :
  next()
};

module.exports = tagValidation
