const asyncHandler = require('express-async-handler');
const BotSettings = require('../models/BotSettings');

// @desc    Get bot settings
// @route   GET /api/bot-settings
// @access  Public
const getBotSettings = asyncHandler(async (req, res) => {
    let settings = await BotSettings.findOne();
    if (!settings) {
        // Create default settings if none exist
        settings = await BotSettings.create({
            faqs: [
                { question: "How to buy property?", answer: "Browse our properties page and contact us via the form or WhatsApp!" },
                { question: "Do you offer rentals?", answer: "Yes, we have many luxury rentals available in prime locations." }
            ]
        });
    }
    res.json(settings);
});

// @desc    Update bot settings
// @route   PUT /api/bot-settings
// @access  Private/Admin
const updateBotSettings = asyncHandler(async (req, res) => {
    let settings = await BotSettings.findOne();

    if (settings) {
        settings.welcomeMessage = req.body.welcomeMessage || settings.welcomeMessage;
        settings.luxuryThemeColor = req.body.luxuryThemeColor || settings.luxuryThemeColor;
        settings.faqs = req.body.faqs || settings.faqs;
        settings.updatedAt = Date.now();

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } else {
        const newSettings = await BotSettings.create(req.body);
        res.status(201).json(newSettings);
    }
});

module.exports = {
    getBotSettings,
    updateBotSettings
};
