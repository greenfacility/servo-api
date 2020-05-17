const express = require('express');
const auth = require('../config/auth');
const router = express.Router();
const User = require('../service/user.service');
// User Model
// const User = require('../model/User');
// Get User for password
router.get('/forgotpassword', auth, User.getAUserForPassword);

// Get a particular user
router.get('/:id', auth, User.getUserFromDb);

// Get all users
router.get('/', User.getAllUsersFromDb);

// Send Email to confirm password
router.post('/forgotpassword', User.sendEmailForPassReq);

// Update User Password
router.patch('/forgotpassword', User.updateUserPass);

// // Update User Password
// router.get('/forgotpassword/:token', User.getUserForPass);

// For Register
router.post('/', User.insertNewUserToDb);

router.delete('/:id', auth, User.deleteUserFromDb);

router.patch('/:id', auth, User.updateUserFromDb);

router.patch('/type/:id', auth, User.changeUsersType);

module.exports = router;
