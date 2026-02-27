const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'testuser@example.com';
        const password = 'password123';

        await User.deleteOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            name: 'Test Payment User',
            email,
            password: hashedPassword,
            role: 'User'
        });

        console.log('✓ Test user created: testuser@example.com / password123');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error creating test user:', error);
    }
};

createTestUser();
