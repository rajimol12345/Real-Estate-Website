const mongoose = require('mongoose');
require('dotenv').config();
const BlogPost = require('./models/BlogPost');

const db = process.env.MONGO_URI;

const blogs = [
    {
        title: 'Modern House architecture',
        content: 'This is Photoshop\'s version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.',
        author: 'Admin',
        imageUrl: '1.jpg',
        datePosted: new Date()
    },
    {
        title: 'Living room design',
        content: 'This is Photoshop\'s version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.',
        author: 'Admin',
        imageUrl: '2.jpg',
        datePosted: new Date()
    },
    {
        title: 'Bed room design',
        content: 'This is Photoshop\'s version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.',
        author: 'Admin',
        imageUrl: '3.jpg',
        datePosted: new Date()
    }
];

const seedBlogs = async () => {
    try {
        await mongoose.connect(db);
        console.log('MongoDB Connected for Blog Seeding...');
        await BlogPost.deleteMany({});
        await BlogPost.insertMany(blogs);
        console.log('Blogs Seeded Successfully!');
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedBlogs();
