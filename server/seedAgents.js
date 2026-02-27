const mongoose = require('mongoose');
require('dotenv').config();
const Agent = require('./models/Agent');

const db = process.env.MONGO_URI;

const agents = [
    {
        name: 'David Walter',
        photo: '1.jpg',
        isRealtor: true,
        phone: '900 123 456 789 00',
        email: 'agent@estatepro.com'
    },
    {
        name: 'David Walter',
        photo: '2.jpg',
        isRealtor: true,
        phone: '900 123 456 789 00',
        email: 'agent@estatepro.com'
    },
    {
        name: 'David Walter',
        photo: '3.jpg',
        isRealtor: true,
        phone: '900 123 456 789 00',
        email: 'agent@estatepro.com'
    },
    {
        name: 'David Walter',
        photo: '4.jpg',
        isRealtor: true,
        phone: '900 123 456 789 00',
        email: 'agent@estatepro.com'
    }
];

const seedAgents = async () => {
    try {
        await mongoose.connect(db);
        console.log('MongoDB Connected for Agent Seeding...');
        await Agent.deleteMany({});
        await Agent.insertMany(agents);
        console.log('Agents Seeded Successfully!');
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAgents();
