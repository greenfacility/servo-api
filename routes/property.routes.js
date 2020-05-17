const express = require('express');
const auth = require('../config/auth');
const router = express.Router();

const Property = require('../service/property.service');

router.get('/', Property.find);

router.get('/:id', Property.findOne);

router.post('/', auth, Property.post);

router.delete('/:id', auth, Property.delete);

router.patch('/:id', Property.patch);

module.exports = router;
