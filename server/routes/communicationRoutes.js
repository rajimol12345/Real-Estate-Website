const express = require('express');
const router = express.Router();
const {
    createInquiry,
    createCallbackRequest,
} = require('../controllers/communicationController');

router.post('/inquiries', createInquiry);
router.post('/callbacks', createCallbackRequest);

module.exports = router;
