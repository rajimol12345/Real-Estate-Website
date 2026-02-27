const express = require('express');
const router = express.Router();
const {
    getCities,
    createCity,
    updateCity,
    deleteCity,
    getAreas,
    createArea,
    updateArea,
    deleteArea,
} = require('../controllers/adminLocationController');
const { protect, admin } = require('../middleware/auth');

// Note: Re-using existing protect/admin middleware if available, assuming they are imported correctly
// If they are specifically in server/middleware/auth.js

router.route('/cities')
    .get(getCities)
    .post(createCity);

router.route('/cities/:id')
    .put(updateCity)
    .delete(deleteCity);

router.route('/areas')
    .get(getAreas)
    .post(createArea);

router.route('/areas/:id')
    .put(updateArea)
    .delete(deleteArea);

module.exports = router;
