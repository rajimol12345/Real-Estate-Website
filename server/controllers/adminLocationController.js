const City = require('../models/City');
const Area = require('../models/Area');
const asyncHandler = require('express-async-handler');

// @desc    Get all cities
// @route   GET /api/admin/cities
// @access  Private/Admin
const getCities = asyncHandler(async (req, res) => {
    const cities = await City.find({}).sort({ name: 1 });
    res.json(cities);
});

// @desc    Create a city
// @route   POST /api/admin/cities
// @access  Private/Admin
const createCity = asyncHandler(async (req, res) => {
    const { name, status } = req.body;

    const cityExists = await City.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (cityExists) {
        res.status(400);
        throw new Error('City already exists');
    }

    const city = await City.create({ name, status });
    res.status(201).json(city);
});

// @desc    Update a city
// @route   PUT /api/admin/cities/:id
// @access  Private/Admin
const updateCity = asyncHandler(async (req, res) => {
    const city = await City.findById(req.params.id);

    if (city) {
        city.name = req.body.name || city.name;
        city.status = req.body.status || city.status;

        const updatedCity = await city.save();
        res.json(updatedCity);
    } else {
        res.status(404);
        throw new Error('City not found');
    }
});

// @desc    Delete a city
// @route   DELETE /api/admin/cities/:id
// @access  Private/Admin
const deleteCity = asyncHandler(async (req, res) => {
    const city = await City.findById(req.params.id);

    if (city) {
        // Check if city has areas
        const areaCount = await Area.countDocuments({ cityId: city._id });
        if (areaCount > 0) {
            res.status(400);
            throw new Error('Cannot delete city that has active areas. Please delete areas first.');
        }
        await city.deleteOne();
        res.json({ message: 'City removed' });
    } else {
        res.status(404);
        throw new Error('City not found');
    }
});

// Areas

// @desc    Get areas by city
// @route   GET /api/admin/areas
// @access  Private/Admin
const getAreas = asyncHandler(async (req, res) => {
    const { cityId } = req.query;
    const filter = cityId ? { cityId } : {};
    const areas = await Area.find(filter).populate('cityId', 'name').sort({ name: 1 });
    res.json(areas);
});

// @desc    Create an area
// @route   POST /api/admin/areas
// @access  Private/Admin
const createArea = asyncHandler(async (req, res) => {
    const { cityId, name, status } = req.body;

    const areaExists = await Area.findOne({
        cityId,
        name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (areaExists) {
        res.status(400);
        throw new Error('Area already exists in this city');
    }

    const area = await Area.create({ cityId, name, status });
    const populatedArea = await Area.findById(area._id).populate('cityId', 'name');
    res.status(201).json(populatedArea);
});

// @desc    Update an area
// @route   PUT /api/admin/areas/:id
// @access  Private/Admin
const updateArea = asyncHandler(async (req, res) => {
    const area = await Area.findById(req.params.id);

    if (area) {
        area.name = req.body.name || area.name;
        area.cityId = req.body.cityId || area.cityId;
        area.status = req.body.status || area.status;

        const updatedArea = await area.save();
        const populatedArea = await Area.findById(updatedArea._id).populate('cityId', 'name');
        res.json(populatedArea);
    } else {
        res.status(404);
        throw new Error('Area not found');
    }
});

// @desc    Delete an area
// @route   DELETE /api/admin/areas/:id
// @access  Private/Admin
const deleteArea = asyncHandler(async (req, res) => {
    const area = await Area.findById(req.params.id);

    if (area) {
        await area.deleteOne();
        res.json({ message: 'Area removed' });
    } else {
        res.status(404);
        throw new Error('Area not found');
    }
});

module.exports = {
    getCities,
    createCity,
    updateCity,
    deleteCity,
    getAreas,
    createArea,
    updateArea,
    deleteArea,
};
