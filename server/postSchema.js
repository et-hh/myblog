const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  tags: Array,
  title: String,
  lastUpdated: Date,
  excerpt: String,
  strippedContent: String
}, { collection: 'posts' })

module.exports = mongoose.model('Post', postSchema)