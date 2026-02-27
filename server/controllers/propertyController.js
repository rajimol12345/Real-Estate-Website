const asyncHandler = require('express-async-handler');
const Property = require('../models/Property');
const Notification = require('../models/Notification');
const SavedSearch = require('../models/SavedSearch');
const { translateText } = require('../utils/translator');

// @desc    Get all properties with filtering
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const { type, location, beds, baths, sqft, minPrice, maxPrice, keyword, boundary } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;

  let query = {};

  if (keyword) {
    query.$or = [
      { title: new RegExp(keyword, 'i') },
      { description: new RegExp(keyword, 'i') }
    ];
  }

  // Handle Boundary Search (Drawing on map)
  if (boundary) {
    try {
      // Expecting boundary as a stringified array of coordinates: [[lng, lat], [lng, lat], ...]
      const coords = JSON.parse(boundary);
      if (coords && coords.length > 2) {
        // Ensure polygon is closed (last point = first point)
        if (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1]) {
          coords.push(coords[0]);
        }
        query.geoPoint = {
          $geoWithin: {
            $geometry: {
              type: 'Polygon',
              coordinates: [coords]
            }
          }
        };
      }
    } catch (e) {
      console.error("Invalid boundary format:", e);
    }
  }

  if (type && type !== 'any') {
    query.type = new RegExp(type, 'i');
  }

  if (location && location !== 'any') {
    query.location = new RegExp(location, 'i');
  }

  if (beds && beds !== 'any') {
    query.beds = { $gte: parseInt(beds) };
  }

  if (baths && baths !== 'any') {
    query.baths = { $gte: parseInt(baths) };
  }

  if (sqft && sqft !== 'any') {
    query.sqft = { $gte: parseInt(sqft) };
  }

  if (minPrice && minPrice !== 'any' || maxPrice && maxPrice !== 'any') {
    query.price = {};
    if (minPrice && minPrice !== 'any') query.price.$gte = parseInt(minPrice);
    if (maxPrice && maxPrice !== 'any') query.price.$lte = parseInt(maxPrice);
  }

  const total = await Property.countDocuments(query);
  const properties = await Property.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    properties,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page
  });
});

// Helper function to check if a property matches saved search filters
const checkPropertyMatch = (property, filters) => {
  if (filters.type && filters.type !== 'any' && !new RegExp(filters.type, 'i').test(property.type)) return false;
  if (filters.location && filters.location !== 'any' && !new RegExp(filters.location, 'i').test(property.location)) return false;
  if (filters.beds && filters.beds !== 'any' && property.beds < parseInt(filters.beds)) return false;
  if (filters.baths && filters.baths !== 'any' && property.baths < parseInt(filters.baths)) return false;
  if (filters.minPrice && filters.minPrice !== 'any' && property.price < parseInt(filters.minPrice)) return false;
  if (filters.maxPrice && filters.maxPrice !== 'any' && property.price > parseInt(filters.maxPrice)) return false;
  return true;
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = asyncHandler(async (req, res) => {
  console.log(`>>> [DEBUG] getPropertyById called with ID: ${req.params.id}`);
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      console.log(`>>> [DEBUG] Property found: ${property.title?.en || property.title}`);
      res.json(property);
    } else {
      console.log(`>>> [DEBUG] Property not found for ID: ${req.params.id}`);
      res.status(404);
      throw new Error('Property not found');
    }
  } catch (error) {
    console.error(`>>> [DEBUG] Error in getPropertyById: ${error.message}`);
    // If it's a CastError, specifically mention it
    if (error.name === 'CastError') {
      res.status(400);
      throw new Error(`Invalid Property ID format: ${req.params.id}`);
    }
    throw error;
  }
});

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Admin
const createProperty = asyncHandler(async (req, res) => {
  const { title, description, ...otherData } = req.body;

  // Auto-translate dynamic content (Write-Time Translation)
  const translatedTitle = typeof title === 'string' ? await translateText(title) : title;
  const translatedDescription = typeof description === 'string' ? await translateText(description) : description;

  const property = new Property({
    title: translatedTitle,
    description: translatedDescription,
    ...otherData
  });

  const createdProperty = await property.save();

  if (createdProperty) {
    // 1. Create System Notification for Admin
    await Notification.create({
      title: 'New Property Created',
      message: `New property "${createdProperty.title}" has been added to the listings.`,
      type: 'property',
      link: `/properties/${createdProperty._id}`
    });

    // 2. Notify users with matching saved searches
    const savedSearches = await SavedSearch.find({});

    for (const search of savedSearches) {
      let isMatch = checkPropertyMatch(createdProperty, search.filters);

      // If filters match, check boundary if it exists
      if (isMatch && search.boundary && search.boundary.coordinates) {
        // Simple check: is the property within the boundary?
        // MongoDB $geoWithin logic for a single point
        const matchCount = await Property.countDocuments({
          _id: createdProperty._id,
          geoPoint: {
            $geoWithin: {
              $geometry: {
                type: 'Polygon',
                coordinates: search.boundary.coordinates
              }
            }
          }
        });
        isMatch = matchCount > 0;
      }

      if (isMatch) {
        // Create a personal notification for the user
        await Notification.create({
          user: search.user, // We need to update Notification model to support specific users
          title: 'New Listing Match!',
          message: `A new property matching your search "${search.name}" is now available: ${createdProperty.title}`,
          type: 'property',
          link: `/property/${createdProperty._id}`
        });
        // In a real app, you would also trigger an email here
        console.log(`Notification sent to user ${search.user} for search ${search.name}`);
      }
    }
  }

  res.status(201).json(createdProperty);
});

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const property = await Property.findById(id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  const { title, description, ...otherData } = req.body;

  // Handle localized title update
  if (title !== undefined) {
    if (typeof title === 'string') {
      property.title = await translateText(title);
    } else if (typeof title === 'object' && title !== null) {
      // Merge with existing
      const newTitle = {
        ...(property.title && typeof property.title.toObject === 'function' ? property.title.toObject() : property.title),
        ...title
      };
      if (!newTitle.en && property.title?.en) newTitle.en = property.title.en;
      property.title = newTitle;
    }
  }

  // Handle localized description update
  if (description !== undefined) {
    if (typeof description === 'string') {
      property.description = await translateText(description);
    } else if (typeof description === 'object' && description !== null) {
      const newDesc = {
        ...(property.description && typeof property.description.toObject === 'function' ? property.description.toObject() : property.description),
        ...description
      };
      if (!newDesc.en && property.description?.en) newDesc.en = property.description.en;
      property.description = newDesc;
    }
  }

  // Exclude immutable or internal fields from being set directly
  delete otherData._id;
  delete otherData.__v;
  delete otherData.createdAt;
  delete otherData.updatedAt;

  // Manually update remaining fields instead of using property.set(otherData)
  // which can sometimes clear other fields if not careful in nested structures
  Object.keys(otherData).forEach(key => {
    property[key] = otherData[key];
  });

  try {
    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    console.error('Save error details:', error);
    res.status(400);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    }

    throw new Error(error.message || 'Error updating property');
  }
});

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (property) {
    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } else {
    res.status(404);
    throw new Error('Property not found');
  }
});

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};