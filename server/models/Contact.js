
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ContactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: false
  },
  status: { type: String, enum: ['New', 'Read', 'Replied'], default: 'New' },
  dateReceived: { type: Date, default: Date.now }
});

module.exports = Contact = mongoose.model('contact', ContactSchema);
