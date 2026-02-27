const mongoose = require('mongoose');

const savedSearchSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    filters: {
      type: Object, // Stores all search parameters (type, beds, price, etc.)
      required: true,
    },
    boundary: {
      type: {
        type: String,
        enum: ['Polygon'],
      },
      coordinates: {
        type: [[[Number]]], // [[[lng, lat], ...]]
      }
    },
    notificationType: {
      type: String,
      enum: ['email', 'push', 'both', 'none'],
      default: 'email',
    },
    lastNotified: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

const SavedSearch = mongoose.model('SavedSearch', savedSearchSchema);

module.exports = SavedSearch;
