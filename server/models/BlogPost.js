
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BlogPostSchema = new Schema({
  title: {
    en: { type: String, required: true },
    bn: { type: String },
    de: { type: String },
    nl: { type: String }
  },
  content: {
    en: { type: String, required: true },
    bn: { type: String },
    de: { type: String },
    nl: { type: String }
  },
  author: { type: String, default: 'Admin' },
  imageUrl: { type: String },
  comments: [{
    user: { type: String },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }],
  datePosted: { type: Date, default: Date.now }
});

module.exports = BlogPost = mongoose.model('blogpost', BlogPostSchema);
