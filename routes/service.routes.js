const express = require('express');
const auth = require('../config/auth');
const router = express.Router();
const Service = require('../service/service.service');

// Get All Service
router.get('/', Service.find);

// Get A Service
router.get('/:id', Service.findOne);

// Add A Service
router.post('/', auth, Service.post);

// Update A Service
router.patch('/:id', auth, Service.update);

// Delete A Service
router.delete('/:id', auth, Service.delete);

module.exports = router;
