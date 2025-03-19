const mongoose = require('mongoose');

const storeItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  description: { type: String, required: true },
  qty: { type: Number, required: true },
  buyingPrice: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  }, // Reference to the Category model
  photo: { type: String } // Store Base64 string for the item's photo
});

// Export the model using CommonJS syntax
module.exports = mongoose.model('StoreItem', storeItemSchema);