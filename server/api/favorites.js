const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const { protect } = require('../middleware/auth');

// @desc    Add or remove property from favorites
// @route   POST /api/favorites/toggle
// @access  Private
router.post('/toggle', protect, async (req, res) => {
    const { propertyId } = req.body;
    const userId = req.user._id;

    try {
        const existing = await Favorite.findOne({ user: userId, property: propertyId });
        if (existing) {
            await Favorite.findByIdAndDelete(existing._id);
            return res.json({ isFavorite: false, message: 'Removed from favorites' });
        } else {
            await Favorite.create({ user: userId, property: propertyId });
            return res.status(201).json({ isFavorite: true, message: 'Added to favorites' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id }).populate('property');
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Check if property is favorited
// @route   GET /api/favorites/status/:propertyId
// @access  Private
router.get('/status/:propertyId', protect, async (req, res) => {
    try {
        const favorite = await Favorite.findOne({ user: req.user._id, property: req.params.propertyId });
        res.json({ isFavorite: !!favorite });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
