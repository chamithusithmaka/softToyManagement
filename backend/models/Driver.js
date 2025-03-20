const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: { type: String, required: true },
    status: { type: String, enum: ['Available', 'Unavailable'], default: 'Available' },
  });
  
  module.exports = mongoose.model('Driver', driverSchema);