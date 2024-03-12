const express = require("express");
const postRouter = new express.Router();
const upload = require("../middleware/upload");
const postController = require("../controllers/postController");
const multerUpload = upload.array("media", 20);
const verifyJWT = require("../middleware/verifyJWT");

postRouter.get("/api/posts", postController.fetchPosts);
postRouter.get("/api/posts/:category/:postId", postController.fetchPost);
postRouter.post("/api/posts", verifyJWT, multerUpload, postController.newPost);
postRouter.patch("/api/posts/:postId/edit", verifyJWT, multerUpload, postController.editPost)
postRouter.delete("/api/posts/:postId", verifyJWT, postController.deletePost)

module.exports = postRouter;
