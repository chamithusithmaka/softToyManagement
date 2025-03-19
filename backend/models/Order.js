const mongoose = require('mongoose');

// Define the schema
const orderSchema = new mongoose.Schema({
  userId: { 
    // Commented out the ObjectId type to allow storing fake user IDs as strings
    // type: mongoose.Schema.Types.ObjectId, 
    // ref: 'User', 
    // required: true 
    type: String, // Allow storing fake user IDs as strings
    required: true // Ensure the userId is still required
  },
  customerInfo: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { 
      type: String, 
      required: true, 
      match: [/^\d{10}$/, 'Phone number must be 10 digits'] // Example validation for 10-digit phone numbers
    },
    email: { 
      type: String, 
      required: true, 
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'] // Email format validation
    },
  },
  items: [{
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 }
  }],
  paymentInfo: {
    cardNumber: { type: String, required: true }, // Be careful with sensitive data in production
    expirationDate: { type: String, required: true },
    cvv: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
}, { timestamps: true });

// Export the model using CommonJS syntax
module.exports = mongoose.model('Order', orderSchema);