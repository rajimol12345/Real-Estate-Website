const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
});

const BotSettingsSchema = new mongoose.Schema({
    welcomeMessage: {
        type: String,
        default: "Hi there! 👋 Welcome to EstatePro. How can I help you today?"
    },
    luxuryThemeColor: {
        type: String,
        default: "#1a365d" // Navy
    },
    faqs: [FAQSchema],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BotSettings', BotSettingsSchema);
