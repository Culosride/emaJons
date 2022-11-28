const express = require('express');
const upload = require('../middleware/upload');
const { Image } = require('../models/image');
const Post = require('../models/post');
const { uploadToCloudinary, removeFromCloudinary } = require('../services/cloudinary.config');

const router = new express.Router();

router.get('/posts', async (req, res) => {
  try {
    const allPosts = await Post.find();
    res.render("posts", {posts: allPosts});
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/login", (req, res) => {
  res.render("login")
})

router.get("/", (req, res) => {
  res.render("adminForm")
});

router.post('/posts', upload.array('postImages', 20), async (req, res) => {
  try {
    const post = new Post(req.body);
    const savedPost = await post.save();
    const images = req.files;
    await Promise.all(images.map(async (image) => {
      const data = await uploadToCloudinary(image.path, 'emaJons_dev');
      const newImage = new Image({
        publicId: data.public_id,
        imageUrl: data.url,
      });
      await Post.updateOne(
        { _id: savedPost._id },
        { $addToSet: { images: [newImage]}}
        )
      }));
      res.redirect('/posts')
    }
    catch (err) {
      res.status(400).send(err);
    }
});


// router.delete('/image/:id', async (req, res) => {
//   try {
//     const user = await User.findOne({ _id: req.params.id });
//     const publicId = user.publicId;
//     await removeFromCloudinary(publicId);
//     const deleteImg = await User.updateOne(
//       { _id: req.params.id },
//       {
//         $set: {
//           imageUrl: '',
//           publicId: '',
//         },
//       }
//     );
//     res.status(200).send('post image deleted successfully!');
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

module.exports = router;
