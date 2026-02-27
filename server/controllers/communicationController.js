const asyncHandler = require('express-async-handler');
const Inquiry = require('../models/Inquiry');
const CallbackRequest = require('../models/CallbackRequest');
const Property = require('../models/Property');
const sendEmail = require('../utils/emailService');

// @desc    Create a new property inquiry
// @route   POST /api/communication/inquiry
// @access  Public
const createInquiry = asyncHandler(async (req, res) => {
    const { name, phone, email, message, propertyId } = req.body;

    if (!name || !phone || !message || !propertyId) {
        res.status(400);
        throw new Error('Please provide all required fields (name, phone, message, propertyId)');
    }

    const property = await Property.findById(propertyId);
    if (!property) {
        res.status(404);
        throw new Error('Property not found');
    }

    const inquiry = await Inquiry.create({
        name,
        phone,
        email,
        message,
        property: propertyId,
    });

    // Send email notification to admin
    try {
        const propTitle = typeof property.title === 'string' ? property.title : property.title?.en;
        await sendEmail({
            email: process.env.ADMIN_EMAIL,
            subject: `New Property Inquiry: ${propTitle}`,
            message: `You have a new inquiry for the property "${propTitle}" (ID: ${propertyId}).\n\nUser Details:\nName: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\n\nMessage:\n${message}`,
            html: `<h3>New Property Inquiry</h3><p>You have a new inquiry for the property <strong>"${propTitle}"</strong> (ID: ${propertyId}).</p><h4>User Details:</h4><ul><li><strong>Name:</strong> ${name}</li><li><strong>Phone:</strong> ${phone}</li><li><strong>Email:</strong> ${email || 'N/A'}</li></ul><h4>Message:</h4><p>${message}</p>`,
        });
    } catch (error) {
        console.error('Email notification failed:', error.message);
        // We don't throw error here to ensure the user still gets a success response for their inquiry
    }

    res.status(201).json({
        success: true,
        data: inquiry,
        message: 'Inquiry submitted successfully',
    });
});

// @desc    Create a new callback request
// @route   POST /api/communication/callback
// @access  Public
const createCallbackRequest = asyncHandler(async (req, res) => {
    const { name, phone, preferredTime, propertyId } = req.body;

    if (!name || !phone || !preferredTime || !propertyId) {
        res.status(400);
        throw new Error('Please provide all required fields (name, phone, preferredTime, propertyId)');
    }

    const property = await Property.findById(propertyId);
    if (!property) {
        res.status(404);
        throw new Error('Property not found');
    }

    const callbackRequest = await CallbackRequest.create({
        name,
        phone,
        preferredTime,
        property: propertyId,
    });

    // Send email notification to admin
    try {
        const propTitle = typeof property.title === 'string' ? property.title : property.title?.en;
        await sendEmail({
            email: process.env.ADMIN_EMAIL,
            subject: `New Callback Request: ${propTitle}`,
            message: `You have a new callback request for the property "${propTitle}" (ID: ${propertyId}).\n\nUser Details:\nName: ${name}\nPhone: ${phone}\nPreferred Time: ${preferredTime}`,
            html: `<h3>New Callback Request</h3><p>You have a new callback request for the property <strong>"${propTitle}"</strong> (ID: ${propertyId}).</p><h4>User Details:</h4><ul><li><strong>Name:</strong> ${name}</li><li><strong>Phone:</strong> ${phone}</li><li><strong>Preferred Time:</strong> ${preferredTime}</li></ul>`,
        });
    } catch (error) {
        console.error('Email notification failed:', error.message);
    }

    res.status(201).json({
        success: true,
        data: callbackRequest,
        message: 'Callback request submitted successfully',
    });
});

module.exports = {
    createInquiry,
    createCallbackRequest,
};
