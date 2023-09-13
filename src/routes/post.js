const express = require("express");
const postRouter = new express.Router();
const upload = require("../middleware/upload");
const multerUpload = upload.array("media", 20);
// const multerUpload = upload.fields([{ name: "media", maxCount: 20 }, { name: "previewImg", maxCount: 1 }]);
const verifyJWT = require("../middleware/verifyJWT");
// const validatePath = require("../middleware/pathValidation")
const Post = require("../models/post");
const Category = require("../models/category");
const { Media } = require("../models/media");
const {
  uploadToCloudinary,
  removeFromCloudinary,
  removeVideoFromCloudinary,
  generatePreview,
} = require("../services/cloudinary.config");
const _ = require("lodash");
require("dotenv").config();

// routes for BasicUsers
// fetch all posts
postRouter.get("/api/posts", async (req, res) => {
  try {
    // Group posts by category and limit each group to the first 9 posts
    const pipeline = [
      {
        $group: {
          _id: '$category',
          posts: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          category: '$_id',
          posts: { $slice: ['$posts', 9] },
        },
      },
    ];

    const result = await Post.aggregate(pipeline);

    const first10PostsForEachCategory = result.map((categoryData) => categoryData.posts).flat();

    res.status(200).json(first10PostsForEachCategory);
  } catch (err) {
    res.status(404).send(err);
  }
});

// fetch all posts
// postRouter.get("/api/posts", async (req, res) => {
//   try {
//     const allPosts = await Post.find({}).populate({ path: "postTags" });
//     res.status(200).json(allPosts);
//   } catch (err) {
//     res.status(404).send(err);
//   }
// });

// fetch posts by category
postRouter.get("/api/categories/:category", async (req, res) => {
  const { category } = req.params
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 9;
  try {
    const posts = await Post.find({category: category})
      .skip((page) * pageSize)
      .limit(pageSize)
      .populate({ path: "postTags" });
    res.status(200).json({posts: posts, moreData: Boolean(posts.length)});
  } catch (err) {
    res.status(404).send(err);
  }
});

// fetch post by id
postRouter.get("/api/posts/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId });
    res.status(200).json(post);
  } catch (err) {
    res.status(400).send(err);
  }
});

// routes requiring authorization
// create post
postRouter.post("/posts", verifyJWT, multerUpload, async (req, res) => {
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
      preview: generatePreview(data.public_id)
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
});

// edit post
postRouter.patch("/posts/:postId/edit", verifyJWT, multerUpload, async (req, res) => {
    if (!req.body.postTags) req.body.postTags = [];
    const update = Object.assign({}, req.body);
    const incomingMedia = req.files;

    const post = await Post.findOne({ _id: req.params.postId }).exec();
    if (!post) return res.status(204).json({ message: "No post found with this id." });

    if (!update.media) {
      // Each old media deleted, new media added
      const publicIds = post.media.map((med) => med.publicId);
      // the req.files.media will populate the updated post.media
      update.media = [];
      await removeFromCloudinary(publicIds);
      await removeVideoFromCloudinary(publicIds);
    } else {
      // if any of the old media exist in incoming update
      update.media =
        typeof update.media === "string" ? [update.media] : update.media;
      update.media = update.media.map((med) => JSON.parse(med));
      const mediaToDelete = post.media.filter((postMedia) =>
        update.media.every((newMedia) => {
          return postMedia.publicId !== newMedia.publicId;
        })
      );

      // remove public id from cloudinary
      const publicIds = mediaToDelete.map((med) => med.publicId);
      if (publicIds.length) {
        await removeFromCloudinary(publicIds);
        await removeVideoFromCloudinary(publicIds);
      }
    }

    // update post
    await post.updateOne({ $set: update }, { new: true }).exec();

    // handle new media
    if (incomingMedia) {
      for (let i = 0; i < incomingMedia.length; i++) {
        const med = incomingMedia[i];

        // gets media file type
        const mediaType = med.mimetype.split("/")[0];

        const data = await uploadToCloudinary(
          med.path,
          "emaJons_dev",
          mediaType
        );

        const newMedia = new Media({
          publicId: data.public_id,
          url: data.url,
          mediaType,
          preview: generatePreview(data.public_id)
        });

        await Post.updateOne(
          { _id: post._id },
          { $addToSet: { media: [newMedia] } }
        );
      }
    }

    const updatedPost = await Post.findById(post._id);

    res.status(200).json(updatedPost);
  }
);

// delete post
postRouter.delete("/:category/:postId", verifyJWT, async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findOne({ _id: postId }).exec();
    console.log("post to delete:", post);
    if (!post) return res.status(204).json({ message: "No post found with this id." });

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
});

module.exports = postRouter;
