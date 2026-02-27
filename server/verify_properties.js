const mongoose = require('mongoose');
const Property = require('./models/Property');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const verifyProperties = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const count = await Property.countDocuments();
        console.log(`Total Properties: ${count}`);

        const properties = await Property.find({}, 'title _id');
        console.log('Properties:', properties.map(p => ({ id: p._id, title: p.title.en })));

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyProperties();
