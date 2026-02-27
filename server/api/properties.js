const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().populate('agent');
    res.json(properties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('agent');
    if (!property) {
      return res.status(404).json({ msg: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Property not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @desc    Create a property
// @route   POST /api/properties
// @access  Private (e.g., Admin/Agent only) - authentication middleware needed
router.post('/', async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    const property = await newProperty.save();
    res.status(201).json(property);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add PUT, DELETE routes similarly

module.exports = router;