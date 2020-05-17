const express = require('express');
const auth = require('../config/auth');
const router = express.Router();
const Location = require('../service/location.service');

// Get All Location
router.get('/', Location.getAllLocationFromDb);

// Get A Location
router.get('/:id', Location.getALocationFromDb);

// Add A Location
router.post('/', auth, Location.addNewLocation);

// Update A Location
router.patch('/:id', auth, Location.updateLocation);

// Delete A Location
router.delete('/:id', auth, Location.deleteLocationFromDb);

module.exports = router;
