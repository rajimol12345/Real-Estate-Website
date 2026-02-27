const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    console.log('Generating token for ID:', id);
    // Use environment variable or a default fallback secret for development
    const secret = process.env.JWT_SECRET || 'estatepro_default_temporary_secret_2026';

    if (!process.env.JWT_SECRET) {
        console.warn('WARNING: Using default fallback JWT secret. Please check your .env configuration.');
    }

    return jwt.sign({ id }, secret, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    console.log('--- Register Attempt ---');
    console.log('Request body:', req.body);
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        console.log('Validation failed: Missing fields');
        res.status(400);
        throw new Error('Please include all fields');
    }

    try {
        console.log('Checking if user exists...');
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('Conflict: User already exists');
            res.status(400);
            throw new Error('User already exists');
        }

        console.log('Hashing password...');
        let hashedPassword;
        try {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        } catch (bcryptErr) {
            console.error('Bcrypt error:', bcryptErr);
            throw new Error('Error processing password');
        }

        console.log('Creating user in DB...');
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'User'
        });

        if (user) {
            console.log('User created. Generating token...');
            let token;
            try {
                token = generateToken(user._id);
            } catch (jwtErr) {
                console.error('JWT Error:', jwtErr);
                // Even if token fails, user was created. But we need to respond.
                throw new Error('User created but token generation failed');
            }

            console.log('Registration successful');

            // Create Notification for Admin
            await Notification.create({
                title: 'New User Registered',
                message: `New user ${user.name} (${user.email}) has joined as a ${user.role}.`,
                type: 'system',
                link: '/users'
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            });
        } else {
            console.log('User creation returned null');
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        console.error('Caught in registerUser:', error.message);
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw error;
    }
});

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    console.log('--- Login Attempt ---');
    const { email, password } = req.body;
    console.log('Email provided:', email);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found:', email);
            res.status(401);
            throw new Error('Invalid credentials');
        }

        console.log('User found, comparing passwords...');
        if (!user.password) {
            console.error('User record is missing a password hash:', email);
            res.status(500);
            throw new Error('User record corrupted');
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log('Password match. Generating token...');
            const token = generateToken(user._id);
            console.log('Login successful');

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            });
        } else {
            console.log('Password mismatch for:', email);
            res.status(401);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error('Caught in loginUser:', error.message);
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw error;
    }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
    };
    res.status(200).json(user);
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    console.log('>>> ENTERED updateUserProfile controller <<<');
    console.log('--- Update Profile Attempt ---');
    console.log('User ID from token:', req.user?._id);

    const user = await User.findById(req.user._id);

    if (user) {
        // Check if email is being updated and if it's already taken
        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                res.status(400);
                throw new Error('Email already in use');
            }
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            console.log('Updating password...');
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();
        console.log('Profile updated successfully for:', updatedUser.email);

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    } else {
        console.log('User not found in DB during update');
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateUserProfile,
};
