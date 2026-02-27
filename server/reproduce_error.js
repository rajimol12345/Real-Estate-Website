const mongoose = require('mongoose');
const path = require('path');
const Property = require('./models/Property');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const reproduceError = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const id = '699692024ad2fd0f03a53b40';
        const prop = await Property.findById(id);
        
        console.log('Original prop title.en:', prop.title.en);

        // Simulate the payload from ManageGallery.jsx
        const payload = {
            media: {
                featuredImage: '',
                galleryImages: ['/uploads/test.jpg'],
                floorPlans: [],
                walkthrough3D: '',
                virtualTour360: '',
                videoTour: '',
                brochurePdf: ''
            }
        };

        // This is what the controller does:
        const { title, description, ...otherData } = payload;
        // title and description are undefined here.
        
        prop.set(otherData);
        
        console.log('After set(), title.en is:', prop.title?.en);

        try {
            await prop.save();
            console.log('✓ Save successful in reproduction');
        } catch (err) {
            console.log('✗ Save FAILED in reproduction:', err.message);
            if (err.errors) {
                Object.keys(err.errors).forEach(key => {
                    console.log(`  - ${key}: ${err.errors[key].message}`);
                });
            }
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Reproduction failed:', error);
        process.exit(1);
    }
};

reproduceError();
