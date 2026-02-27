const mongoose = require('mongoose');
const path = require('path');
const Property = require('./models/Property');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const inspectProperty = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const id = '699692024ad2fd0f03a53b44';
        const prop = await Property.findById(id);
        if (!prop) {
            console.log('Property not found');
        } else {
            console.log('Property found:');
            console.log(JSON.stringify(prop, null, 2));
            console.log('Validation results:');
            const err = prop.validateSync();
            if (err) {
                console.log('✗ Validation FAILED in memory:', err.message);
            } else {
                console.log('✓ Validation PASSED in memory');
            }
        }
        process.exit(0);
    } catch (error) {
        console.error('Inspection failed:', error);
        process.exit(1);
    }
};

inspectProperty();
