const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    budget: {
        type: String
    },
    interest: {
        type: String,
        default: 'Other'
    },
    intent: {
        type: String,
        default: 'Unknown'
    },
    source: {
        type: String,
        default: 'Website'
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Qualified', 'Lost'],
        default: 'New'
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Lead', LeadSchema);
