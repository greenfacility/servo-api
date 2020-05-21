const express = require('express');
const auth = require('../config/auth');
const router = express.Router();
const Equipment = require('../service/equipment.service');

router.get('/', Equipment.get);

router.get('/:id', Equipment.getOne);

router.post('/', auth, Equipment.create);

router.patch('/:id', auth, Equipment.patch);

router.put('/select/:id', auth, Equipment.select);

router.put('/submit/:id/:lendId', auth, Equipment.submit);

router.delete('/:id', auth, Equipment.delete);

module.exports = router;
