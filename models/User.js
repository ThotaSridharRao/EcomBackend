const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'employee'],
    default: 'user'
  },
  image: {
    type: String,
    default: ''
  },
  phone: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
