const mongoose = require('mongoose');

const AreaSchema = mongoose.Schema(
    {
        cityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'City',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate area names in the same city
AreaSchema.index({ cityId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Area', AreaSchema);
