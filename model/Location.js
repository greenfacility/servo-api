const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  }
})

const Location = mongoose.model('location', LocationSchema)

module.exports = Location
