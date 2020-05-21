const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    available: {
      type: Number,
      required: true,
    },
    request: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        number: { type: Number },
      },
    ],
  },
  { timestamps: true },
);

const Inventory = mongoose.model('inventory', InventorySchema);

module.exports = Inventory;
