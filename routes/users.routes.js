const express = require('express');
const auth = require('../config/auth');
const router = express.Router();
const User = require('../service/user.service');

// Get a particular user
router.get('/:id', User.getAUserFromDb);

// Get all users
router.get('/', auth, User.getAllUsersFromDb);

router.patch('/:id', auth, User.updateUserFromDb);

module.exports = router;
