const mongoose = require('mongoose');

const PaymentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        property: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Property',
        },
        orderId: {
            type: String,
            required: true,
        },
        paymentId: {
            type: String,
        },
        signature: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'USD',
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
