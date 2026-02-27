const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Agent = require('./models/Agent');

const listAgents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const agents = await Agent.find({}, '_id name');
        console.log('Agents:', agents.map(a => ({ id: a._id, name: a.name })));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listAgents();
