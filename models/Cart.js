const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    qty: {
      type: Number,
      required: true,
      default: 1
    },
    price: { // Optional snapshot price
      type: Number
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
