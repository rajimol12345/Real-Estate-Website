const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

console.log('Notification Router Loaded');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
    let query = {};
    
    // If not admin, only show notifications for the logged-in user
    if (req.user.role !== 'Admin') {
        query.user = req.user._id;
    } else {
        // For admin, show global notifications (user: null) and their own
        query.$or = [{ user: req.user._id }, { user: null }];
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
}));

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
router.put('/:id/read', protect, asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        notification.isRead = true;
        await notification.save();
        res.json({ message: 'Notification marked as read' });
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
}));

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private/Admin
router.put('/read-all', protect, asyncHandler(async (req, res) => {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
}));

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        await notification.deleteOne();
        res.json({ message: 'Notification removed' });
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
}));

module.exports = router;
