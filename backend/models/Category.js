const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryCode: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
  }, {
      timestamps: true,
  });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;