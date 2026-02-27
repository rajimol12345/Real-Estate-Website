const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    sender: {
        type: String,
        enum: ['user', 'bot'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    intent: {
        type: String
    },
    metadata: {
        propertyContext: [mongoose.Schema.Types.ObjectId],
        suggestedProperties: [mongoose.Schema.Types.ObjectId]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', MessageSchema);
