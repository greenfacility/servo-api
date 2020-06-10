const express = require('express');
const auth = require('../config/auth');
const router = express.Router();
const Inspection = require('../service/inspection.service');

router.post('/', auth, Inspection.create);

router.get('/', Inspection.get);

router.get('/:id', Inspection.getOne);

router.delete('/:id', auth, Inspection.delete);

module.exports = router;
