const Category = require('../models/category');
const _ = require('lodash');



module.exports = async function noDups(req, res, next) {
  console.log(req.body)
  const [ tag, category ] = req.body
  const selectedCategory = await Category.findOne({ name: _.capitalize(category) });
  console.log(selectedCategory)
    selectedCategory.categoryTags.some(catTag => tag === catTag) ?
    res.status(400).send({errorMessage: "Tag already exists"}) :
    next()
};
