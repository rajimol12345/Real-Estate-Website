const mongoose = require('mongoose');

const InquirySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
        },
        email: {
            type: String,
        },
        message: {
            type: String,
            required: [true, 'Please add a message'],
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

const Inquiry = mongoose.model('Inquiry', InquirySchema);

module.exports = Inquiry;
