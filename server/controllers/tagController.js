const Post = require("../models/post");
const Category = require("../models/category");
const _ = require("lodash");

const fetchTags = async (req, res) => {
  try {
    const posts = await Post.find({
      postTags: { $exists: true, $not: { $size: 0 } },
    });

    let categoryTags = {
      Walls: [],
      Paintings: [],
      Sketchbooks: [],
      Video: [],
      Sculptures: [],
    };

    // Assigns to each category its tags
    posts.forEach((post) => {
      categoryTags[post.category] = [
        ...categoryTags[post.category],
        ...post.postTags,
      ];
    });

    // Eliminates duplicates
    Object.keys(categoryTags).forEach((key) => {
      categoryTags[key] = [...new Set(categoryTags[key])];
    });

    const category = await Category.findOne({ name: "dummy" }).exec();

    res.status(200).json({ categoryTags, availableTags: category.allTags });
  } catch (err) {
    res.status(400).send(err);
  }
};

// PROTECTED ROUTES
// Create tag
const newTag = async (req, res) => {
  const { newTag } = req.body;
  const capitalizedTag = _.capitalize(newTag);
  try {
    await Category.findOneAndUpdate(
      { name: "dummy" },
      { $push: { allTags: capitalizedTag } }
    );
    res.status(200).json(capitalizedTag);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Delete tag
const deleteTag =  async (req, res) => {
  const { tag: tagToDelete } = req.params;

  try {
    await Category.findOneAndUpdate(
      { name: "dummy" },
      { $pull: { allTags: tagToDelete } }
    );
    await Post.updateMany({}, { $pull: { postTags: tagToDelete } });

    res.status(200).json({ deletedTag: tagToDelete, message: "Tag deleted" });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = { fetchTags, newTag, deleteTag};
