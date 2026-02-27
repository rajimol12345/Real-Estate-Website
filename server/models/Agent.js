const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an agent name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be more than 20 characters'],
  },
  description: {
    en: { type: String },
    bn: { type: String },
    de: { type: String },
    nl: { type: String }
  },
  photo: {
    type: String, // URL to agent photo
    default: 'no-photo.jpg',
  },
  isRealtor: {
    type: Boolean,
    default: true,
  },
  dateHired: {
    type: Date,
    default: Date.now,
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Agent', AgentSchema);