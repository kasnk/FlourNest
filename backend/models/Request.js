const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  containerType: { type: String, required: true },
  uniqueId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);