const mongoose = require('mongoose');
require('dotenv').config();
const Property = require('./models/Property');

const db = process.env.MONGO_URI;

const properties = [
    {
        title: '5/33 Joynton Avenue, Zetland',
        price: 244000,
        location: 'Zetland, ASC 1255',
        beds: 3,
        baths: 2,
        sqft: 5000,
        imageURL: 'https://demoxml.com/html/estatepro/images/listing/1.jpg', // Placeholder or external
        status: 'For Sale',
        type: 'House'
    },
    {
        title: '4/82 Chicago, Warners Bay',
        price: 359000,
        location: 'Warners Bay, NSW 2282',
        beds: 3,
        baths: 2,
        sqft: 5000,
        imageURL: 'https://demoxml.com/html/estatepro/images/listing/2.jpg',
        status: 'For Rent',
        type: 'Apartment'
    },
    {
        title: '1/57 New York Avenue',
        price: 359000,
        location: 'Warners Bay, NSW 2282',
        beds: 3,
        baths: 2,
        sqft: 5000,
        imageURL: 'https://demoxml.com/html/estatepro/images/listing/3.jpg',
        status: 'For Sale',
        type: 'House'
    },
    {
        title: '6/22 Chicago, Warners Bay',
        price: 450000,
        location: 'Warners Bay, NSW 2282',
        beds: 4,
        baths: 3,
        sqft: 6200,
        imageURL: 'https://demoxml.com/html/estatepro/images/listing/4.jpg',
        status: 'For Sale',
        type: 'House'
    },
    {
        title: '2/10 Joynton Avenue',
        price: 180000,
        location: 'Zetland, ASC 1255',
        beds: 2,
        baths: 1,
        sqft: 3000,
        imageURL: 'https://demoxml.com/html/estatepro/images/listing/5.jpg',
        status: 'For Rent',
        type: 'Apartment'
    },
    {
        title: '9/44 New York Avenue',
        price: 550000,
        location: 'Warners Bay, NSW 2282',
        beds: 5,
        baths: 4,
        sqft: 7500,
        imageURL: 'https://demoxml.com/html/estatepro/images/listing/6.jpg',
        status: 'For Sale',
        type: 'Commercial'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(db);
        console.log('MongoDB Connected for Strict Seeding...');

        await Property.deleteMany({});
        console.log('Old Properties Deleted...');

        await Property.insertMany(properties);
        console.log('6 Reference Properties Seeded Successfully!');

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
