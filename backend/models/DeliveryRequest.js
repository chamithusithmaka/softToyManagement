const mongoose = require('mongoose');

const deliveryRequestSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
  status: { type: String, enum: ['Pending', 'Assigned', 'Out for Delivery', 'Delivered', 'Cancelled'], default: 'Pending' },
  deliveryDate: { type: Date, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('DeliveryRequest', deliveryRequestSchema);