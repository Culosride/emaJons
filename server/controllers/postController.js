const Post = require("../models/post");
const Category = require("../models/category");
const { Media } = require("../models/media");
const _ = require("lodash");
const { POSTS_TO_LOAD } = require("../config/posts.config");
const {
  uploadToCloudinary,
  removeFromCloudinary,
  removeVideoFromCloudinary,
  generatePreview,
} = require("../config/cloudinary.config");

//////////////////////////// routes for BasicUsers /////////////////////////////
const fetchPosts = async (req, res) => {
  const { category, page, pageSize = POSTS_TO_LOAD } = req.query;

  try {
    if (category) {
      const pageNum = parseInt(page) || 1;
      const size = parseInt(pageSize);

      const posts = await Post.find({ category })
        .skip((pageNum - 1) * size)
        .limit(size)
        .populate({ path: "postTags" });

      const moreData = posts.length === size;

      if (!posts) return res.status(404).json({ error: "Posts not found" });

      res.status(200).json({ posts, moreData });
    } else {
      // Group posts by category and limit each group to the first 9 posts
      const pipeline = [
        {
          $group: {
            _id: "$category",
            posts: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            category: "$_id",
            posts: { $slice: ["$posts", POSTS_TO_LOAD] },
          },
        },
      ];

      const result = await Post.aggregate(pipeline);
      const posts = result.map((categoryData) => categoryData.posts).flat();
      res.status(200).json(posts);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

// Fetch Post by ID
const fetchPost = async (req, res) => {
  const { postId, category } = req.params;
  try {
    const post = await Post.findOne({ _id: postId });
    if (post.category !== _.capitalize(category)) {
      return res.status(404).json({message: "This page doesn't exist."});
    }
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    res.status(400).send(err);
  }
};

/////////////////////////////// protected routes ///////////////////////////////
// Create Post
const newPost = async (req, res) => {
  const post = new Post(req.body);
  const savedPost = await post.save();
  const incomingMedia = req.files;

  for (let i = 0; i < incomingMedia.length; i++) {
    const med = incomingMedia[i];
    const mediaType = med.mimetype.split("/")[0];

    const data = await uploadToCloudinary(med.path, "emaJons_dev", mediaType);

    const newMedia = new Media({
      publicId: data.public_id,
      url: data.url,
      mediaType,
      preview: generatePreview(data.public_id),
    });

    await Post.updateOne(
      { _id: post._id },
      { $addToSet: { media: [newMedia] } }
    );
  }

  const updatedPost = await Post.findById(savedPost._id).populate({
    path: "postTags",
  });

  res.status(200).json(updatedPost);
};

// Update Post
const editPost = async (req, res) => {
  if (!req.body.postTags) req.body.postTags = [];
  const update = Object.assign({}, req.body);
  const incomingMedia = req.files;

  const post = await Post.findOne({ _id: req.params.postId }).exec();
  if (!post)
    return res.status(204).json({ message: "No post found with this id." });

  if (!update.media) {
    // Each old media deleted, new media added
    const publicIds = post.media.map((med) => med.publicId);
    // The req.files.media will populate the updated post.media
    update.media = [];
    await removeFromCloudinary(publicIds);
    await removeVideoFromCloudinary(publicIds);
  } else {
    // If any of the old media exist in incoming update
    update.media =
      typeof update.media === "string" ? [update.media] : update.media;
    update.media = update.media.map((med) => JSON.parse(med));
    const mediaToDelete = post.media.filter((postMedia) =>
      update.media.every((newMedia) => {
        return postMedia.publicId !== newMedia.publicId;
      })
    );

    // Remove public id from cloudinary
    const publicIds = mediaToDelete.map((med) => med.publicId);
    if (publicIds.length) {
      await removeFromCloudinary(publicIds);
      await removeVideoFromCloudinary(publicIds);
    }
  }

  // Post update
  await post.updateOne({ $set: update }, { new: true }).exec();

  // Handle new media
  if (incomingMedia) {
    for (let i = 0; i < incomingMedia.length; i++) {
      const med = incomingMedia[i];

      // Gets media file type
      const mediaType = med.mimetype.split("/")[0];

      const data = await uploadToCloudinary(med.path, "emaJons_dev", mediaType);

      const newMedia = new Media({
        publicId: data.public_id,
        url: data.url,
        mediaType,
        preview: generatePreview(data.public_id),
      });

      await Post.updateOne(
        { _id: post._id },
        { $addToSet: { media: [newMedia] } }
      );
    }
  }

  const updatedPost = await Post.findById(post._id);

  res.status(200).json(updatedPost);
};

// Delete Post
const deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findOne({ _id: postId }).exec();
    console.log("post to delete:", post);
    if (!post)
      return res.status(204).json({ message: "No post found with this id." });

    const publicIds = post.media.map((med) => med.publicId);

    if (publicIds.length) {
      await removeFromCloudinary(publicIds);
      await removeVideoFromCloudinary(publicIds);
    }
    await post.deleteOne();

    res.status(200).json({ message: "post deleted successfully" });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = { fetchPosts, fetchPost, newPost, editPost, deletePost };
