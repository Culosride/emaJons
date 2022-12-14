const Category = require('../models/category');
const _ = require("lodash")

module.exports = async function noDups(req, res, next) {
  const { newTag } = req.body
  const capitalizedTag = _.capitalize(newTag)
  const selectedCategory = await Category.findOne({});
  selectedCategory.allTags.some(catTag => catTag === capitalizedTag) ?
  res.status(400).send({message: "Tag already exists"}) :
  next()
};
