const express = require('express');
const Category = require('../models/Category.js'); // Adjust the path if necessary

const router = express.Router();
// Create a new category
router.post('/categories', async (req, res) => {
  try {
    console.log("Request received to create a new category:", req.body);

    const { categoryCode, name, description } = req.body;

    // Validate required fields
    if (!categoryCode || !name || !description) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({ error: "Validation failed: Missing required fields" });
    }

    const newCategory = new Category({
      categoryCode,
      name,
      description,
    });

    console.log("Saving new category to the database...");
    await newCategory.save();
    console.log("Category created successfully:", newCategory);

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Fetch all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }); // Sort by creation date, most recent first
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single category by ID
router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a category by ID
router.put('/categories/:id', async (req, res) => {
  try {
    const { categoryCode, name, description } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { categoryCode, name, description },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a category by ID
router.delete('/categories/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
