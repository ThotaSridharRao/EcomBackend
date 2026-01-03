const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Custom ID from frontend
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, linking to registered user
  date: { type: String },
  time: { type: String },
  total: { type: String },
  status: { type: String, default: 'Processing' },
  statusColor: { type: String, default: 'warning' },
  expectedDelivery: { type: String },
  deliveredDate: { type: String },
  currentStep: { type: Number, default: 1 },

  payment: {
    method: String,
    details: String,
    isOnline: Boolean,
    status: String,
    transactionId: String,
    date: String
  },

  address: {
    name: String,
    line1: String,
    line2: String,
    phone: String
  },

  vendor: {
    name: String,
    gst: String,
    address: String
  },

  bill: {
    subtotal: String,
    tax: String,
    shipping: String,
    discount: String,
    total: String
  },

  items: [{
    name: String,
    image: String,
    qty: Number,
    price: String,
    id: String // Frontend Product ID
  }],

  timeline: [{
    title: String,
    date: String,
    completed: Boolean
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
