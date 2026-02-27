const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Property = require('../models/Property');
const crypto = require('crypto');

// @desc    Create a payment order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const { propertyId, amount } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
        res.status(404);
        throw new Error('Property not found');
    }

    if (property.isBooked) {
        res.status(400);
        throw new Error('Property is already booked');
    }

    // This would typically call Stripe/Razorpay API
    // Simulating order creation
    const orderId = `order_${Math.random().toString(36).substring(7).toUpperCase()}`;

    const payment = await Payment.create({
        user: req.user._id,
        property: propertyId,
        orderId,
        amount,
        status: 'pending',
    });

    res.status(201).json({
        success: true,
        orderId,
        amount,
        currency: 'USD',
        propertyTitle: property.title.en,
    });
});

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
    const { orderId, paymentId, signature } = req.body;

    const payment = await Payment.findOne({ orderId });

    if (!payment) {
        res.status(404);
        throw new Error('Payment record not found');
    }

    // In a real integration, we'd verify the signature here
    // Example (Razorpay): 
    // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    // hmac.update(orderId + "|" + paymentId);
    // const generated_signature = hmac.digest('hex');
    // if (generated_signature !== signature) throw new Error('Invalid signature');

    // For simulation/sandbox:
    payment.paymentId = paymentId || `pay_${Math.random().toString(36).substring(7)}`;
    payment.signature = signature || 'mock_sig_123';
    payment.status = 'completed';
    await payment.save();

    // Mark property as booked
    await Property.findByIdAndUpdate(payment.property, { isBooked: true });

    res.json({
        success: true,
        message: 'Payment verified and property booked successfully',
    });
});

// @desc    Get user's bookings
// @route   GET /api/payments
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Payment.find({ user: req.user._id, status: 'completed' })
        .populate('property')
        .sort('-createdAt');

    res.json(bookings);
});

module.exports = {
    createOrder,
    verifyPayment,
    getMyBookings,
};
