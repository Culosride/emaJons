const Category = require('../models/category');

module.exports = async function noDups(req, res, next) {
  const { newTag } = req.body
  const selectedCategory = await Category.findOne({});
  selectedCategory.allTags.some(catTag => catTag === newTag) ?
  res.status(400).send({message: "Tag already exists"}) :
  next()
};
