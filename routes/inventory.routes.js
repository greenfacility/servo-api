const express = require('express');
const auth = require('../config/auth');
const router = express.Router();
const Inventory = require('../service/inventory.service');

router.get('/', Inventory.get);

router.get('/:id', Inventory.getOne);

router.post('/', auth, Inventory.create);

router.patch('/:id', auth, Inventory.patch);

router.put('/select/:id', auth, Inventory.select);

router.put('/submit/:id/:lendId', auth, Inventory.submit);

router.delete('/:id', auth, Inventory.delete);

module.exports = router;
