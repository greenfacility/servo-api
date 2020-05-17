const express = require('express');
const auth = require('../config/auth');
const router = express.Router();

const RequestOut = require('../service/requestout.service');

router.get('/', RequestOut.find);

router.get('/:id', RequestOut.findOne);

router.post('/', auth, RequestOut.post);

router.put('/:id', auth, RequestOut.putSchedule);

router.patch('/:id', auth, RequestOut.patch);

router.delete('/:id', auth, RequestOut.delete);

module.exports = router;
