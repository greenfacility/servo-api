const mongoose = require('mongoose')

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

const Service = mongoose.model('service', ServiceSchema)

module.exports = Service
