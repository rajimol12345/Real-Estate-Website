const asyncHandler = require('express-async-handler');
const BlogPost = require('../models/BlogPost');
const { translateText } = require('../utils/translator');

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
const getBlogs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const total = await BlogPost.countDocuments({});
    const blogs = await BlogPost.find({})
        .sort({ datePosted: -1 })
        .skip(skip)
        .limit(limit);

    const formattedBlogs = blogs.map(blog => {
        let finalImageUrl;
        if (blog.imageUrl) {
            let cleanedImageUrl = blog.imageUrl.replace(/\\/g, '/').split('/').filter(Boolean).join('/');
            if (cleanedImageUrl.includes('uploads/')) {
                const parts = cleanedImageUrl.split('uploads/');
                const filename = parts[parts.length - 1];
                finalImageUrl = `/uploads/${filename}`;
            } else {
                const parts = cleanedImageUrl.split('/');
                const filename = parts[parts.length - 1];
                finalImageUrl = `/blog/${filename}`;
            }
        } else {
            finalImageUrl = '/blog/1.jpg';
        }

        return {
            ...blog._doc,
            imageUrl: finalImageUrl,
        };
    });

    res.json({
        blogs: formattedBlogs,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
    });
});

// @desc    Get blog post by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = asyncHandler(async (req, res) => {
    try {
        const blog = await BlogPost.findById(req.params.id);
        if (blog) {
            res.json(blog);
        } else {
            res.status(404);
            throw new Error('Blog post not found');
        }
    } catch (error) {
        if (error.name === 'CastError') {
            res.status(400);
            throw new Error(`Invalid Blog Post ID format: ${req.params.id}`);
        }
        throw error;
    }
});

// @desc    Create blog post
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = asyncHandler(async (req, res) => {
    const { title, content, author, imageUrl } = req.body;
    
    // Auto-translate (Write-Time)
    const translatedTitle = typeof title === 'string' ? await translateText(title) : title;
    const translatedContent = typeof content === 'string' ? await translateText(content) : content;

    const blog = new BlogPost({
        title: translatedTitle,
        content: translatedContent,
        author,
        imageUrl
    });
    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
});

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = asyncHandler(async (req, res) => {
    const blog = await BlogPost.findById(req.params.id);

    if (blog) {
        const { title, content, author, imageUrl } = req.body;

        if (title) {
            blog.title = typeof title === 'string' ? await translateText(title) : title;
        }
        if (content) {
            blog.content = typeof content === 'string' ? await translateText(content) : content;
        }
        
        blog.author = author || blog.author;
        blog.imageUrl = imageUrl || blog.imageUrl;

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } else {
        res.status(404);
        throw new Error('Blog post not found');
    }
});

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await BlogPost.findById(req.params.id);

    if (blog) {
        await blog.deleteOne();
        res.json({ message: 'Blog post removed' });
    } else {
        res.status(404);
        throw new Error('Blog post not found');
    }
});

module.exports = {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
};
