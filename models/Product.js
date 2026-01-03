const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  // Extended Fields matching AddProduct.jsx
  code: { type: String, default: '' },
  hsnCode: { type: String, default: '' },
  unit: { type: String, default: '' },
  subCategory: { type: String, default: '' },
  brand: { type: String, default: '' },
  mrp: { type: Number, default: 0 },
  purchasePrice: { type: Number, default: 0 },
  sellingPriceTaxType: { type: String, enum: ['Inclusive', 'Exclusive'], default: 'Inclusive' },
  sellingPriceTaxRate: { type: Number, default: 0 },
  purchasePriceTaxType: { type: String, enum: ['Inclusive', 'Exclusive'], default: 'Inclusive' },
  purchasePriceTaxRate: { type: Number, default: 0 },
  batchNo: { type: String, default: '' },
  mfgDate: { type: Date },
  expDate: { type: Date },

  description: {
    type: String,
    default: ''
  },
  specs: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    default: 50
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
