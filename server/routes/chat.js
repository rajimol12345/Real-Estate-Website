const express = require('express');
const router = express.Router();
const {
    handleChatMessage,
    getChatHistory,
    getChatAnalytics
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.post('/', handleChatMessage);
router.get('/history/:threadId', getChatHistory);
router.get('/analytics', protect, getChatAnalytics);

module.exports = router;
