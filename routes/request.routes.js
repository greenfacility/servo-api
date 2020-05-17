const express = require('express');
const auth = require('../config/auth');
const router = express.Router();

const Request = require('../service/request.service');

router.get('/', Request.find);

router.get('/:id', Request.findOne);

router.post('/', auth, Request.post);

router.put('/:id', auth, Request.putSchedule);

router.patch('/:id', auth, Request.patch);

router.delete('/:id', auth, Request.delete);

module.exports = router;
