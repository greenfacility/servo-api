const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    available: {
      type: Number,
      required: true,
    },
    users: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true },
);

const Equipment = mongoose.model('equipment', EquipmentSchema);

module.exports = Equipment;
