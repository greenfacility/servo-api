const mongoose = require('mongoose')

const PropertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  property: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  ownId: {
    type: String,
    required: true
  }
})

const Property = mongoose.model('property', PropertySchema)

module.exports = Property
