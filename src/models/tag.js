const mongoose = require("mongoose")

const tagSchema = new mongoose.Schema({
  name: String,
  tag: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
}, {timestamps: true})

const Tag = mongoose.model('Tag', tagSchema);

module.exports = { Tag, tagSchema }
