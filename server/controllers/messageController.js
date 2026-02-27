const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');
const Notification = require('../models/Notification');

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const total = await Contact.countDocuments({});
    const messages = await Contact.find({})
        .sort({ dateReceived: -1 })
        .skip(skip)
        .limit(limit);

    res.json({
        messages,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
    });
});

// @desc    Get message by ID
// @route   GET /api/messages/:id
// @access  Private/Admin
const getMessageById = asyncHandler(async (req, res) => {
    const message = await Contact.findById(req.params.id);
    if (message) {
        res.json(message);
    } else {
        res.status(404);
        throw new Error('Message not found');
    }
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = asyncHandler(async (req, res) => {
    const message = await Contact.findById(req.params.id);

    if (message) {
        await message.deleteOne();
        res.json({ message: 'Message removed' });
    } else {
        res.status(404);
        throw new Error('Message not found');
    }
});

const updateMessage = asyncHandler(async (req, res) => {
    const message = await Contact.findById(req.params.id);

    if (message) {
        message.status = req.body.status || message.status;
        const updatedMessage = await message.save();
        res.json(updatedMessage);
    } else {
        res.status(404);
        throw new Error('Message not found');
    }
});

// @desc    Create new message
// @route   POST /api/messages
// @access  Public
const createMessage = asyncHandler(async (req, res) => {
    const { name, email, website, subject, message, propertyId } = req.body;

    const newMessage = await Contact.create({
        name,
        email,
        website,
        subject: subject || 'New Website Inquiry',
        message,
        property: propertyId
    });

    if (newMessage) {
        // Enhance notification message if it's about a property
        let notiMsg = `New message from ${name} regarding ${subject || 'Inquiry'}.`;
        if (propertyId) {
            const Property = require('../models/Property');
            const prop = await Property.findById(propertyId);
            if (prop) {
                const title = typeof prop.title === 'string' ? prop.title : prop.title?.en;
                notiMsg = `${name} inquired about property: "${title}"`;
            }
        }

        // Create Notification for Admin
        await Notification.create({
            title: propertyId ? 'Property Inquiry' : 'New Contact Message',
            message: notiMsg,
            type: 'contact',
            link: '/messages'
        });

        res.status(201).json(newMessage);
    } else {
        res.status(400);
        throw new Error('Invalid message data');
    }
});

module.exports = {
    getMessages,
    getMessageById,
    updateMessage,
    deleteMessage,
    createMessage
};
