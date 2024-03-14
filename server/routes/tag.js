const express = require("express");
const tagRouter = new express.Router();
const tagValidation = require("../middleware/tagValidation");
const tagController = require("../controllers/tagController");

tagRouter.get("/api/tags", tagController.fetchTags);
tagRouter.post("/api/tags", tagValidation, tagController.newTag);
tagRouter.delete("/api/tags/:tag", tagController.deleteTag);

module.exports = tagRouter
