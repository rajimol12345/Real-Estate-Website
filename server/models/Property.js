const mongoose = require('mongoose');

const PropertySchema = mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      bn: { type: String },
      de: { type: String },
      nl: { type: String }
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: false,
    },
    areaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area',
      required: false,
    },
    beds: {
      type: Number,
    },
    baths: {
      type: Number,
    },
    sqft: {
      type: Number,
    },
    imageURL: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      en: { type: String, required: true },
      bn: { type: String },
      de: { type: String },
      nl: { type: String }
    },
    status: {
      type: String, // "For Sale" or "For Rent"
      required: true,
      enum: ['For Sale', 'For Rent', 'Any'],
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String, // "Apartment", "House", "Commercial", "Garage", "Lot"
      required: true,
      default: 'Any'
    },
    amenities: {
      type: [String],
      default: []
    },
    address: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    yearBuilt: {
      type: Number,
    },
    ownerName: {
      type: String,
    },
    ownerEmail: {
      type: String,
    },
    ownerPhone: {
      type: String,
    },
    ownerMessage: {
      type: String,
    },
    averageRating: {
      type: Number,
      default: 0
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    // GeoJSON location for spatial queries
    geoPoint: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    },
    media: {
      featuredImage: { type: String, default: '' },
      galleryImages: { type: [String], default: [] },
      floorPlans: {
        type: [{
          label: { type: String, default: '' },
          image: { type: String, default: '' }
        }],
        default: []
      },
      walkthrough3D: { type: String, default: '' },
      virtualTour360: { type: String, default: '' },
      videoTour: { type: String, default: '' },
      brochurePdf: { type: String, default: '' }
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to keep geoPoint in sync with latitude/longitude
// Pre-save hook to keep geoPoint in sync with latitude/longitude
PropertySchema.pre('save', async function () {
  if (typeof this.latitude === 'number' && typeof this.longitude === 'number' &&
    !isNaN(this.latitude) && !isNaN(this.longitude)) {
    this.geoPoint = {
      type: 'Point',
      coordinates: [this.longitude, this.latitude]
    };
  } else {
    // Remove geoPoint if coords are invalid to avoid index errors
    this.geoPoint = undefined;
  }
});

const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;