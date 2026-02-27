const mongoose = require('mongoose');
require('dotenv').config();
const Property = require('./models/Property');
const BlogPost = require('./models/BlogPost');
const Agent = require('./models/Agent');

const db = process.env.MONGO_URI;

const properties = [
    {
        title: 'Luxury Modern Villa with Pool',
        price: 1250000,
        location: 'Beverly Hills, CA 90210',
        beds: 5,
        baths: 4,
        sqft: 6500,
        imageURL: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        status: 'For Sale',
        type: 'Villa',
        description: 'Luxury modern villa featuring a stunning pool and expansive living spaces in Beverly Hills.'
    },
    {
        title: 'Downtown Luxury Apartment',
        price: 3500,
        location: 'Manhattan, NY 10001',
        beds: 2,
        baths: 2,
        sqft: 1800,
        imageURL: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        status: 'For Rent',
        type: 'Apartment',
        description: 'Sophisticated downtown Manhattan apartment with premium finishes and city views.'
    },
    {
        title: 'Spacious Family House',
        price: 850000,
        location: 'Austin, TX 78701',
        beds: 4,
        baths: 3,
        sqft: 4200,
        imageURL: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        status: 'For Sale',
        type: 'House',
        description: 'Large family home in a prime Austin location with plenty of space for everyone.'
    },
    {
        title: 'Beachfront Condo',
        price: 4200,
        location: 'Miami Beach, FL 33139',
        beds: 3,
        baths: 2,
        sqft: 2100,
        imageURL: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        status: 'For Rent',
        type: 'Apartment',
        description: 'Beautiful beachfront condo in Miami Beach with direct ocean access.'
    },
    {
        title: 'Modern Commercial Space',
        price: 2500000,
        location: 'San Francisco, CA 94102',
        beds: 0,
        baths: 4,
        sqft: 8500,
        imageURL: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        status: 'For Sale',
        type: 'Commercial',
        description: 'Prime commercial property in San Francisco suitable for high-end retail or office space.'
    },
    {
        title: 'Cozy Studio Apartment',
        price: 1800,
        location: 'Seattle, WA 98101',
        beds: 1,
        baths: 1,
        sqft: 650,
        imageURL: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        status: 'For Rent',
        type: 'Apartment',
        description: 'Charming and efficient studio apartment in the heart of Seattle.'
    },
    {
        title: 'Suburban Dream Home',
        price: 675000,
        location: 'Portland, OR 97201',
        beds: 4,
        baths: 2,
        sqft: 3200,
        imageURL: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
        status: 'For Sale',
        type: 'House',
        description: 'Perfect suburban home in Portland with a beautiful garden and modern interior.'
    },
    {
        title: 'Penthouse with City Views',
        price: 8500,
        location: 'Chicago, IL 60601',
        beds: 3,
        baths: 3,
        sqft: 3500,
        imageURL: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        status: 'For Rent',
        type: 'Apartment',
        description: 'Luxury penthouse in Chicago offering breathtaking skyline views and premium amenities.'
    },
    {
        title: 'Charming Victorian House',
        price: 925000,
        location: 'Boston, MA 02101',
        beds: 5,
        baths: 3,
        sqft: 4800,
        imageURL: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        status: 'For Sale',
        type: 'House',
        description: 'Historic Victorian home in Boston with classic features and modern upgrades.'
    },
    {
        title: 'Mountain View Retreat',
        price: 1100000,
        location: 'Denver, CO 80202',
        beds: 4,
        baths: 3,
        sqft: 5200,
        imageURL: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        status: 'For Sale',
        type: 'House',
        description: 'Serene Denver home with stunning mountain views and elegant design.'
    },
    {
        title: 'Loft in Arts District',
        price: 2900,
        location: 'Los Angeles, CA 90012',
        beds: 2,
        baths: 1,
        sqft: 1400,
        imageURL: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        status: 'For Rent',
        type: 'Apartment',
        description: 'Trendy loft in the Los Angeles Arts District, perfect for creative living.'
    },
    {
        title: 'Waterfront Estate',
        price: 3200000,
        location: 'Naples, FL 34102',
        beds: 6,
        baths: 5,
        sqft: 9500,
        imageURL: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        status: 'For Sale',
        type: 'Villa',
        description: 'Magnificent waterfront estate in Naples with world-class amenities.'
    }
];

const blogs = [
    {
        title: '10 Tips for First-Time Home Buyers',
        content: 'Buying your first home is an exciting milestone. Here are essential tips to help you navigate the process: understand your budget, get pre-approved for a mortgage, research neighborhoods thoroughly, work with a trusted real estate agent, and don\'t skip the home inspection. Remember, patience is key in finding the perfect property.',
        author: 'Sarah Johnson',
        imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
        datePosted: new Date('2024-01-15')
    },
    {
        title: 'The Future of Smart Homes',
        content: 'Smart home technology is revolutionizing how we live. From automated lighting and climate control to advanced security systems and voice-activated assistants, modern homes are becoming more efficient and convenient. Discover how these innovations can increase your property value and improve your quality of life.',
        author: 'Michael Chen',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        datePosted: new Date('2024-01-20')
    },
    {
        title: 'Staging Your Home for Maximum Appeal',
        content: 'Proper home staging can significantly impact your sale price and time on market. Learn professional techniques to declutter, depersonalize, and highlight your home\'s best features. Small investments in paint, lighting, and furniture arrangement can yield substantial returns when selling your property.',
        author: 'Emily Rodriguez',
        imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
        datePosted: new Date('2024-01-25')
    },
    {
        title: 'Understanding Real Estate Market Trends',
        content: 'Stay informed about current market conditions to make smart real estate decisions. This comprehensive guide covers interest rates, inventory levels, seasonal patterns, and economic indicators that influence property values. Knowledge is power when buying or selling in today\'s dynamic market.',
        author: 'David Thompson',
        imageUrl: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800',
        datePosted: new Date('2024-02-01')
    },
    {
        title: 'Sustainable Living: Eco-Friendly Home Features',
        content: 'Green building practices are more than a trend—they\'re the future. Explore solar panels, energy-efficient appliances, sustainable materials, and water conservation systems. These features not only reduce your environmental footprint but also lower utility costs and increase property value.',
        author: 'Jennifer Green',
        imageUrl: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
        datePosted: new Date('2024-02-05')
    },
    {
        title: 'Investment Properties: A Beginner\'s Guide',
        content: 'Real estate investment can build wealth over time. Learn about rental properties, fix-and-flip strategies, REITs, and vacation rentals. Understand cash flow analysis, financing options, tax benefits, and risk management to make informed investment decisions.',
        author: 'Robert Martinez',
        imageUrl: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800',
        datePosted: new Date('2024-02-10')
    }
];

const agents = [
    {
        name: 'Jessica Anderson',
        photo: 'https://randomuser.me/api/portraits/women/44.jpg',
        isRealtor: true,
        phone: '+1 (555) 123-4567',
        email: 'jessica.anderson@estatepro.com'
    },
    {
        name: 'Michael Roberts',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg',
        isRealtor: true,
        phone: '+1 (555) 234-5678',
        email: 'michael.roberts@estatepro.com'
    },
    {
        name: 'Sarah Williams',
        photo: 'https://randomuser.me/api/portraits/women/65.jpg',
        isRealtor: true,
        phone: '+1 (555) 345-6789',
        email: 'sarah.williams@estatepro.com'
    },
    {
        name: 'David Chen',
        photo: 'https://randomuser.me/api/portraits/men/46.jpg',
        isRealtor: true,
        phone: '+1 (555) 456-7890',
        email: 'david.chen@estatepro.com'
    },
    {
        name: 'Emily Thompson',
        photo: 'https://randomuser.me/api/portraits/women/28.jpg',
        isRealtor: true,
        phone: '+1 (555) 567-8901',
        email: 'emily.thompson@estatepro.com'
    },
    {
        name: 'James Martinez',
        photo: 'https://randomuser.me/api/portraits/men/52.jpg',
        isRealtor: true,
        phone: '+1 (555) 678-9012',
        email: 'james.martinez@estatepro.com'
    }
];

const seedAll = async () => {
    try {
        await mongoose.connect(db);
        console.log('✓ MongoDB Connected for Complete Seeding...\n');

        await Property.deleteMany({});
        console.log('✓ Cleared existing properties');
        await Property.insertMany(properties);
        console.log(`✓ Seeded ${properties.length} properties\n`);

        await BlogPost.deleteMany({});
        console.log('✓ Cleared existing blog posts');
        await BlogPost.insertMany(blogs);
        console.log(`✓ Seeded ${blogs.length} blog posts\n`);

        await Agent.deleteMany({});
        console.log('✓ Cleared existing agents');
        await Agent.insertMany(agents);
        console.log(`✓ Seeded ${agents.length} agents\n`);

        console.log('========================================');
        console.log('✓ ALL MOCK DATA SEEDED SUCCESSFULLY!');
        console.log('========================================');

        mongoose.connection.close();
    } catch (err) {
        console.error('✗ Seeding Error:', err);
        process.exit(1);
    }
};

seedAll();
