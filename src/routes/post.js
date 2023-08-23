const express = require("express");
const postRouter = new express.Router();
const upload = require("../middleware/upload");
// const multerUpload = upload.array("media", 20);
const multerUpload = upload.fields([{ name: "media", maxCount: 20 }, { name: "previewImg", maxCount: 1 }]);
const verifyJWT = require("../middleware/verifyJWT");
// const validatePath = require("../middleware/pathValidation")
const Post = require("../models/post");
const Category = require("../models/category");
const { Media } = require("../models/media");
const {
  uploadToCloudinary,
  removeFromCloudinary,
  removeVideoFromCloudinary
} = require("../services/cloudinary.config");
const _ = require("lodash");
require("dotenv").config();

// routes for BasicUsers
postRouter.get("/api/posts", async (req, res) => {
  try {
    const allPosts = await Post.find({}).populate({ path: "postTags" });
    res.status(200).json(allPosts);
  } catch (err) {
    res.status(404).send(err);
  }
});

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
  const { media, previewImg } = req.files;
  const postPreviewImg = previewImg[0];

  await Promise.all(
    media.map(async (media) => {
      const mediaType = media.mimetype.split("/")[0];
      const data = await uploadToCloudinary(
        media.path,
        "emaJons_dev",
        mediaType
      );
      console.log("data at post", data);
      const newMedia = new Media({
        publicId: data.public_id,
        url: data.url,
        mediaType,
      });
      await Post.updateOne(
        { _id: savedPost._id },
        { $addToSet: { media: [newMedia] } }
      );
    })
  );

  const mediaType = postPreviewImg.mimetype.split("/")[0];
  const data = await uploadToCloudinary(
    postPreviewImg.path,
    "emaJons_dev",
    mediaType
  );
  const newMedia = new Media({
    publicId: data.public_id,
    url: data.url,
    mediaType,
  });
  post.previewImg = newMedia;
  await post.save();

  const updatedPost = await Post.findById(savedPost._id).populate({
    path: "postTags",
  });
  res.status(200).json(updatedPost);
});

// edit post
postRouter.patch("/posts/:postId/edit", verifyJWT, multerUpload, async (req, res) => {
  if (!req.body.postTags) req.body.postTags = [];
  const update = Object.assign({}, req.body);
  const { previewImg, media } = req.files;
  const postPreviewImg = previewImg && previewImg[0];
  console.log('postPreviewImg', postPreviewImg)
  // filter public id that is not in update media and save public id
  const post = await Post.findOne({ _id: req.params.postId }).exec();
  if (!post)
    return res.status(204).json({ message: "No post found with this id." });

  if (!update.media) {
    // case where all old media are deleted in incoming update and new media are added
    const publicIds = post.media.map((med) => med.publicId);
    // the req.files.media will populate the updated post.media
    update.media = [];
    await removeFromCloudinary(publicIds);
  } else {
    // if any of the old media exist in incoming update
    update.media = typeof update.media === "string" ? [update.media] : update.media;
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
    }
  }

  if (!update.previewImg) {
    // if there is a new preview img in incoming update it won't be in the "update = Object.assign({}, req.body)",
    // but will be in the req.files.previewImg and handled later
    // we can then remove the old preview img from the post
    await removeFromCloudinary(post.previewImg.publicId);

    // handle new preview image
    const mediaType = postPreviewImg.mimetype.split("/")[0];
    const data = await uploadToCloudinary(
      postPreviewImg.path,
      "emaJons_dev",
      mediaType
    );
    const newMedia = new Media({
      publicId: data.public_id,
      url: data.url,
      mediaType,
    });
    post.previewImg = newMedia;
    await post.save()
  } else {
    // else we keep the old preview img
    update.previewImg = post.previewImg;
  }

  // update post
  await post.updateOne({ $set: update }, { new: true }).exec();

  // handle new media
  if (media) {
    await Promise.all(media.map(async (med) => {
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
      });
      await Post.updateOne(
        { _id: post._id },
        { $addToSet: { media: [newMedia] } }
      );
    }));
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
    if (!post)
      return res.status(204).json({ message: "No post found with this id." });

    const publicIds = post.media.map((med) => med.publicId);
    publicIds.push(post.previewImg.publicId)

    if (publicIds.length) {
      await removeFromCloudinary(publicIds);
      await removeVideoFromCloudinary(publicIds)
    }
    await post.deleteOne();

    res.status(200).json({ message: "post deleted successfully" });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = postRouter;
