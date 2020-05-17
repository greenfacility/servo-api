const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    // required: true,
  },
  about: {
    type: String,
    required: true,
  },
  usertype: {
    type: String,
    default: 'user',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  busy: {
    type: Boolean,
    default: false,
  },
  // resetpassword: {
  //   type: String,
  //   required: false,
  // },
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
