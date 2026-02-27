const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Property = require('../models/Property');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @desc    Create or update rating
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, async (req, res) => {
    const { propertyId, rating, comment } = req.body;
    const userId = req.user._id;

    try {
        // 1. Check if user already rated this property
        let review = await Review.findOne({ user: userId, property: propertyId });
        let isNew = false;

        if (review) {
            // Update existing rating
            review.rating = rating;
            review.comment = comment || review.comment;
            await review.save();
        } else {
            // Create new rating
            isNew = true;
            review = await Review.create({
                user: userId,
                property: propertyId,
                rating,
                comment
            });
        }

        // 2. Recalculate Property Average Rating
        const reviews = await Review.find({ property: propertyId });
        const ratingCount = reviews.length;
        const averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / ratingCount;

        const property = await Property.findByIdAndUpdate(propertyId, {
            averageRating: parseFloat(averageRating.toFixed(1)),
            ratingCount
        }, { new: true });

        if (isNew) {
            // Create Notification
            await Notification.create({
                title: 'New Property Review',
                message: `User ${req.user.name} gave ${rating} stars to "${property.title}".`,
                type: 'review',
                link: `/properties/${propertyId}`
            });
        }

        res.status(201).json({ review, averageRating, ratingCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get current user's rating for a property
// @route   GET /api/reviews/user/:propertyId
// @access  Private
router.get('/user/:propertyId', protect, async (req, res) => {
    try {
        const review = await Review.findOne({
            user: req.user._id,
            property: req.params.propertyId
        });
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get property reviews
// @route   GET /api/reviews/property/:propertyId
// @access  Public
router.get('/property/:propertyId', async (req, res) => {
    try {
        const reviews = await Review.find({ property: req.params.propertyId }).populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
