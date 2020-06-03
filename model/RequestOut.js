const mongoose = require('mongoose');

const RequestOutSchema = new mongoose.Schema({
  serial: {
    type: Number,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: false,
  },
  property: {
    type: String,
    required: true,
  },
  propertyId: {
    type: String,
    required: true,
  },
  apartment: {
    type: String,
    required: false,
  },
  phone: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    default: 'pending',
  },
  timestart: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    default: 0,
  },
  assigned: {
    type: String,
    default: 'Unassigned',
  },
  assignedId: {
    type: String,
    default: 'Unassigned',
  },
  priority: {
    type: String,
    default: 'Unassigned',
  },
  actual: {
    type: Number,
    default: 0,
  },
  fixed: {
    type: Number,
    default: 0,
  },
  timecompleted: {
    type: Date,
  },
  timescheduled: {
    type: Date,
  },
});

const RequestOut = mongoose.model('requestout', RequestOutSchema);

module.exports = RequestOut;
