const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    getMe,
    updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/test', (req, res) => res.json({ message: 'Auth router works' }));
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
