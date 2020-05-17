const express = require('express');
const router = express.Router();
const User = require('../service/user.service');

// For Login
router.post('/', User.loginToServer);

module.exports = router;
