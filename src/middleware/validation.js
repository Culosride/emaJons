const Category = require('../models/category');
const _ = require('lodash');

module.exports = async function noDups(req, res, next) {
  const { tag } = req.body
  console.log("taggity", tag)
  // const selectedCategory = await Category.findOne({});
  // selectedCategory.allTags.some(catTag => tag === catTag) ?
  // res.status(400).send({message: "Tag already exists"}) :
  next()
};
