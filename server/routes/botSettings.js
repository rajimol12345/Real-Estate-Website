const express = require('express');
const router = express.Router();
const {
    getBotSettings,
    updateBotSettings
} = require('../controllers/botController');

router.route('/')
    .get(getBotSettings)
    .put(updateBotSettings);

module.exports = router;
