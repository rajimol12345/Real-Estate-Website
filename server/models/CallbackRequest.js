const mongoose = require('mongoose');

const CallbackRequestSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
        },
        preferredTime: {
            type: String,
            required: [true, 'Please add a preferred time'],
        },
        property: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Property',
        },
        status: {
            type: String,
            enum: ['pending', 'called', 'not-answered', 'resolved'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const CallbackRequest = mongoose.model('CallbackRequest', CallbackRequestSchema);

module.exports = CallbackRequest;
