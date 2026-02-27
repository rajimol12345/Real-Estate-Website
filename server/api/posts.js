
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// @route   GET api/posts
// @desc    Get all blog posts
// @access  Public
router.get('/', async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ datePosted: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add POST, PUT, DELETE routes as needed

module.exports = router;
