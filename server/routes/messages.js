const express = require('express');
const router = express.Router();
const {
    getMessages,
    getMessageById,
    updateMessage,
    deleteMessage,
    createMessage,
} = require('../controllers/messageController');

router.route('/')
    .get(getMessages)
    .post(createMessage);
router.route('/:id')
    .get(getMessageById)
    .put(updateMessage)
    .delete(deleteMessage);

module.exports = router;
