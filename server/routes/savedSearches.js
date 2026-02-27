const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const SavedSearch = require('../models/SavedSearch');
const { protect } = require('../middleware/auth');

// @desc    Save a new search/follow neighborhood
// @route   POST /api/saved-searches
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
    const { name, filters, boundary, notificationType } = req.body;

    const savedSearch = await SavedSearch.create({
        user: req.user._id,
        name,
        filters,
        boundary,
        notificationType
    });

    if (savedSearch) {
        res.status(201).json(savedSearch);
    } else {
        res.status(400);
        throw new Error('Invalid search data');
    }
}));

// @desc    Get user's saved searches
// @route   GET /api/saved-searches
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
    const savedSearches = await SavedSearch.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(savedSearches);
}));

// @desc    Delete a saved search
// @route   DELETE /api/saved-searches/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const savedSearch = await SavedSearch.findById(req.params.id);

    if (savedSearch && savedSearch.user.toString() === req.user._id.toString()) {
        await savedSearch.deleteOne();
        res.json({ message: 'Saved search removed' });
    } else {
        res.status(404);
        throw new Error('Search not found or unauthorized');
    }
}));

module.exports = router;
